/**
 * 주소록 관리 페이지
 */

import { useNavigate } from 'react-router-dom';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import { AddressList } from '../components/features/address/AddressList';

const AddressManagementPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-neutral-50 py-5 pb-20 min-[360px]:py-6">
            <div className="mx-auto max-w-2xl px-3 min-[360px]:px-4">
                {/* 헤더 */}
                <div className="mb-5 flex items-center gap-2 min-[360px]:mb-6 min-[360px]:gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 rounded-full hover:bg-neutral-100 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-neutral-700" />
                    </button>
                    <h1 className="text-xl font-bold text-neutral-900">주소록 관리</h1>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-neutral-200">
                    <AddressList />
                </div>
            </div>
        </div>
    );
};

export default AddressManagementPage;
