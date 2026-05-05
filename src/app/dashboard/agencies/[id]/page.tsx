'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loading } from '@/components/ui';
import { AgencyDetailsForm } from '@/components/forms/agency';
import {
  useAppDispatch,
  useGetAgencyByIdQuery,
  useUpdateAgencyByIdMutation,
  setSelectedAgencyId,
} from '@/hooks';
import { useGetCurrentUserQuery } from '@/redux/api/authApi';
import { extractRtkErrorMessage } from '@/utils/rtkErrorHandler';
import { USER_ROLE } from '@/types/enums';

export default function AgencyEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = params?.id ?? '';

  const {
    data,
    isLoading,
    error: fetchError,
  } = useGetAgencyByIdQuery(id, {
    skip: !id,
  });
  const { data: userResp } = useGetCurrentUserQuery();
  const [updateAgency, { isLoading: isSubmitting, error: updateError }] =
    useUpdateAgencyByIdMutation();
  const [success, setSuccess] = useState('');

  // Admins can't edit agency details — bounce them back to the read-only list.
  useEffect(() => {
    if ([USER_ROLE.MANAGER, USER_ROLE.DEPARTMENT_USER].includes(userResp?.data?.role as USER_ROLE)) {
      router.replace('/dashboard/agencies');
    }
  }, [userResp, router]);

  const agency = data?.data;
  const fetchMessage = extractRtkErrorMessage(fetchError);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (fetchMessage) {
    return (
      <div className="px-7 py-8 max-w-3xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded">
          {fetchMessage}
        </div>
      </div>
    );
  }

  const handleSubmit = async (payload: any) => {
    setSuccess('');
    try {
      await updateAgency({ id, data: payload }).unwrap();
      dispatch(setSelectedAgencyId(id));
      setSuccess('Agency updated successfully.');
    } catch {
      // updateError below carries the message
    }
  };

  return (
    <AgencyDetailsForm
      agency={agency}
      title="Edit Agency"
      subtitle="Update agency identity. Changes propagate to forms that prefill from this agency."
      submitLabel="Save Changes"
      submittingLabel="Saving..."
      isSubmitting={isSubmitting}
      submitError={extractRtkErrorMessage(updateError)}
      successMessage={success}
      onSubmit={handleSubmit}
      onCancel={() => router.push('/dashboard/agencies')}
    />
  );
}
