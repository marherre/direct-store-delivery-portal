import { getTranslations } from 'next-intl/server';

export default async function DashboardPage() {
  const t = await getTranslations('dashboard');

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        {t('welcome')}
      </h2>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">
          {t('content')}
        </p>
      </div>
    </div>
  );
}

