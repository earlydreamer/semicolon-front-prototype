import { useState, useEffect, useCallback, useRef } from "react";
import { addressService } from "../../../services/addressService";
import { AddressItem } from "./AddressItem";
import { AddressFormModal } from "./AddressFormModal";
import { Modal } from "../../common/Modal";
import { Button } from "../../common/Button";
import { useToast } from "../../common/Toast";
import type { Address } from "../../../types/address";
import Plus from "lucide-react/dist/esm/icons/plus";
import Loader2 from "lucide-react/dist/esm/icons/loader-2";

interface AddressListProps {
  selectable?: boolean;
  onSelect?: (address: Address) => void;
}

export const AddressList = ({
  selectable = false,
  onSelect,
}: AddressListProps) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const { showToast } = useToast();
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchAddresses = useCallback(
    async (page: number, append = false) => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const response = await addressService.getMyAddresses(page, 10);
        console.log("[DEBUG] getMyAddresses response:", response);

        // ?곗씠??異붿텧 濡쒖쭅 媛쒖꽑: PageResponse 援ъ“ ?먮뒗 諛곗뿴 援ъ“ ???
        const rawItems = response?.content ?? [];
        const newItems: Address[] = rawItems.map((item) => {
          return {
            id: item.id,
            name: item.name || (item.isDefault ? "湲곕낯 諛곗넚吏" : "諛곗넚吏"),
            recipient: item.recipient || "",
            phone: item.phone || "",
            address: item.address || "",
            detailAddress: item.detailAddress || "",
            zonecode: item.zonecode || "",
            isDefault: Boolean(item.isDefault),
          };
        });

        console.log("[DEBUG] Parsed items:", newItems);

        if (append) {
          setAddresses((prev) => [...(prev || []), ...newItems]);
        } else {
          setAddresses(newItems);
        }
        setIsLastPage(response?.last ?? true);
        setCurrentPage(response?.number ?? 0);
      } catch (_error) {
        console.error("[DEBUG] fetchAddresses error:", _error);
        showToast("二쇱냼濡앹쓣 遺덈윭?ㅻ뒗 ???ㅽ뙣?덉뒿?덈떎.", "error");
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, showToast],
  );

  useEffect(() => {
    fetchAddresses(0);
  }, [fetchAddresses]);

  useEffect(() => {
    if (isLastPage || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchAddresses(currentPage + 1, true);
        }
      },
      { threshold: 1.0 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [currentPage, isLastPage, isLoading, fetchAddresses]);

  const handleAddClick = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (address: Address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId === null) return;
    try {
      await addressService.deleteAddress(deleteTargetId);
      showToast("??젣?섏뿀?듬땲??", "success");
      await fetchAddresses(0); // Wrapped in async call
    } catch {
      showToast("??젣???ㅽ뙣?덉뒿?덈떎.", "error");
    } finally {
      setDeleteTargetId(null);
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await addressService.setDefaultAddress(id);
      showToast("湲곕낯 諛곗넚吏濡??ㅼ젙?섏뿀?듬땲??", "success");
      await fetchAddresses(0); // Wrapped in async call
    } catch {
      showToast("?ㅼ젙???ㅽ뙣?덉뒿?덈떎.", "error");
    }
  };

  const handleFormSubmit = async (data: Omit<Address, "id" | "isDefault">) => {
    try {
      if (editingAddress) {
        await addressService.updateAddress(editingAddress.id, data);
        showToast("?섏젙?섏뿀?듬땲??", "success");
      } else {
        await addressService.addAddress(data);
        showToast("??λ릺?덉뒿?덈떎.", "success");
      }
      await fetchAddresses(0); // Wrapped in async call
    } catch {
      showToast("??μ뿉 ?ㅽ뙣?덉뒿?덈떎.", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-neutral-500">
          ?깅줉??諛곗넚吏 {(addresses || []).length}媛?
        </p>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-bold text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>諛곗넚吏 異붽?</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {addresses.map((address) => (
          <AddressItem
            key={address.id}
            address={address}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onSetDefault={handleSetDefault}
            selectable={selectable}
            onSelect={onSelect}
          />
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
        </div>
      )}

      <div ref={observerTarget} className="h-4" />

      {(addresses || []).length === 0 && !isLoading && (
        <div className="text-center py-20 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
          <p className="text-neutral-500 mb-4">?깅줉??二쇱냼媛 ?놁뒿?덈떎.</p>
          <button
            onClick={handleAddClick}
            className="text-primary-600 font-bold hover:underline"
          >
            泥?諛곗넚吏 異붽??섍린
          </button>
        </div>
      )}

      <AddressFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingAddress}
        title={editingAddress ? "諛곗넚吏 ?섏젙" : "諛곗넚吏 異붽?"}
      />

      {/* ??젣 ?뺤씤 紐⑤떖 */}
      <Modal
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        title="諛곗넚吏 ??젣"
        size="sm"
      >
        <div className="space-y-6">
          <p className="text-neutral-600 text-sm">
            ??諛곗넚吏瑜???젣?섏떆寃좎뒿?덇퉴?
          </p>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setDeleteTargetId(null)}
            >
              痍⑥냼
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={handleDeleteConfirm}
            >
              ??젣
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

