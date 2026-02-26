import { useState, useCallback, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { useToast } from '@/components/common/Toast';
import type { AdminUserListItem } from '@/types/admin';

export type UserFilterStatus = 'all' | string;

export const useAdminUsers = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<UserFilterStatus>('all');
    const [users, setUsers] = useState<AdminUserListItem[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { showToast } = useToast();

    // 디바운싱
    useEffect(() => {
        const timer = window.setTimeout(() => {
            setDebouncedQuery(searchQuery.trim());
        }, 300);
        return () => window.clearTimeout(timer);
    }, [searchQuery]);

    const loadUsers = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const response = await adminService.getAdminUsers({
                page: currentPage,
                size: 20,
                keyword: debouncedQuery || undefined,
                status: filterStatus !== 'all' ? filterStatus : undefined,
            });
            setUsers(response.content ?? []);
            setTotalCount(response.totalElements ?? 0);
            setTotalPages(response.totalPages ?? 0);
        } catch (error) {
            console.error('Failed to load admin users:', error);
            setErrorMessage('회원 목록을 불러오지 못했어요.');
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, debouncedQuery, filterStatus]);

    useEffect(() => {
        void loadUsers();
    }, [loadUsers]);

    // 외부 클릭 시 메뉴 닫기
    useEffect(() => {
        if (!openMenuId) return;

        const handleOutsideClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('[data-admin-user-menu]')) {
                setOpenMenuId(null);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpenMenuId(null);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [openMenuId]);

    const toggleMenu = useCallback((userUuid: string) => {
        setOpenMenuId((prev) => (prev === userUuid ? null : userUuid));
    }, []);

    const closeMenu = useCallback(() => {
        setOpenMenuId(null);
    }, []);

    return {
        searchQuery,
        setSearchQuery,
        filterStatus,
        setFilterStatus,
        users,
        totalCount,
        totalPages,
        currentPage,
        setCurrentPage,
        openMenuId,
        isLoading,
        errorMessage,
        loadUsers,
        toggleMenu,
        closeMenu,
        showToast,
    };
};
