import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useSession } from '../context/sessionContext';

export function SessionRedirector() {
  const router = useRouter();
  const { session } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (!session) {
        router.replace('/login');
      }
    }
  }, [isMounted, session]);

  return null;
}
