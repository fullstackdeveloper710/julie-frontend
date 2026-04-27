'use client';

import { useEffect, useState } from 'react';
import { EmptyState } from '@/components/ui';
import { BarChart3 } from 'lucide-react';
import DynamicModal from '@/components/common/Modal';
import { agencyQuestions } from '@/data/agencyQuest';
import { useCreateAgencyMutation } from '@/redux/api/agencyApi';
import { useGetCurrentUserQuery } from '@/redux/api/authApi';

export default function DashboardPage() {
  const [hasData, setHasData] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [apiSuccess, setApiSuccess] = useState('');
  const [apiError, setApiError] = useState('');

  const [createAgency] = useCreateAgencyMutation();

  const { data: userRes, isLoading } = useGetCurrentUserQuery();

  useEffect(() => {
    if (userRes?.data) {
      const shouldShow = userRes.data.showAgencyModal;

      if (shouldShow === false) {
        setOpenModal(true);
      } else {
        setOpenModal(false);
      }
    }
  }, [userRes]);

  // ✅ SUBMIT HANDLER

  const mapAgencyPayload = (data: any) => ({
    name: data.agencyName,
    type: data.agencyType,
    sizeCategory: data.agencySize,
    primaryServiceJurisdiction: data.jurisdiction,
    coverageArea: Number(data.coverage),
  });

  const handleSubmit = async (data: any) => {
    try {
      setApiError('');
      setApiSuccess('');

      const payload = mapAgencyPayload(data);

      const res = await createAgency(payload).unwrap();

      // ✅ SUCCESS
      if (res.success) {
        setApiSuccess(res.message || 'Agency created successfully');
        setTimeout(() => {
          setOpenModal(false);
        }, 1500);
      }
    } catch (error: any) {
      console.error('API ERROR:', error);

      const message = error?.data?.message || error?.message || 'Something went wrong';

      setApiError(message);
    }
  };
  return (
    <div className="px-7 py-8 max-w-6xl mx-auto">
      <DynamicModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title="Complete Your Agency Details"
        questions={agencyQuestions}
        onSubmit={handleSubmit}
        apiError={apiError}
        apiSuccess={apiSuccess}
      />

      {hasData ? (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <BarChart3 className="w-8 h-8" />
              Analytics
            </h1>
            <p className="text-sm">Comprehensive analytics and metrics</p>
          </div>
        </>
      ) : (
        <EmptyState
          title="No Analytics Data Available"
          description="Start by submitting monthly check-ins to see analytics and trends"
          icon="📊"
          layout="centered"
        />
      )}
    </div>
  );
}
