"use client";

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useSession } from 'next-auth/react';

function AdminPage() {
  const [loading, setLoading] = useState(true);  // State to handle loading
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      // Session is still loading, keep loading state true
      return;
    }
    
    if (status === 'authenticated') {
      // Redirect if the user is authenticated but not an admin
      const role = session?.user?.role;
      if (role !== 'admin') {
        router.push('/'); // Redirect to home if the role is not admin
        return;
      }
    } else if (status === 'unauthenticated') {
      router.push('/'); // Redirect to home if not authenticated
      return;
    }

    // If all checks pass, set loading to false and show the content
    setLoading(false);
  }, [status, session, router]);

  if (loading) {
    // You can return a loader or null while redirecting
    return null;
  }

    return (
      <div>
       AdminPage
    </div>
    );
}

export default AdminPage;
