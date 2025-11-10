import { getTranslations } from 'next-intl/server';

export default async function AdminHomePage() {
  const t = await getTranslations('admin');

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        {t('welcome') || 'Admin Dashboard'}
      </h2>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">
          {t('description') || 'Welcome to the admin panel. Manage tenants and system settings from here.'}
        </p>
      </div>
    </div>
  );
}

