import { redirect } from 'next/navigation';
import { getLocalizedRoutes } from '@/shared/constants/routes.constants';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const routes = getLocalizedRoutes(locale);
  redirect(routes.LOGIN);
}

