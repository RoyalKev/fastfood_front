import { useEffect, useState } from 'react';
import { AuthContextProvider } from '../context/authContext'; // Ajustez le chemin si nécessaire
import { useRouter } from 'next/router';
import Script from 'next/script'


function MyApp({ Component, pageProps }) {

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  /*useEffect(() => {
    // Assurez-vous que router.events est défini avant d'ajouter les événements
    if (router && router.events) {
      const handleRouteChangeStart = () => setLoading(true);
      const handleRouteChangeComplete = () => setLoading(false);
      const handleRouteChangeError = () => setLoading(false);

      // Abonnement aux événements de changement de route
      router.events.on('routeChangeStart', handleRouteChangeStart);
      router.events.on('routeChangeComplete', handleRouteChangeComplete);
      router.events.on('routeChangeError', handleRouteChangeError);

      // Nettoyage de l'abonnement lors du démontage du composant
      return () => {
        router.events.off('routeChangeStart', handleRouteChangeStart);
        router.events.off('routeChangeComplete', handleRouteChangeComplete);
        router.events.off('routeChangeError', handleRouteChangeError);
      };
    }
  }, [router]);*/
  return (
    <AuthContextProvider>
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}
export default MyApp;
