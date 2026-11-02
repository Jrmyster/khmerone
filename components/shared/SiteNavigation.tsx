import { siteNavigationHtml } from '@/lib/site-navigation';
export function SiteNavigation() {
  return <div suppressHydrationWarning id="ko-site-shell" dangerouslySetInnerHTML={{ __html: siteNavigationHtml }} />;
}
