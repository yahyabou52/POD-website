// src/components/ui/OAuthButtons.tsx

import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { FaApple, FaGoogle, FaGithub } from 'react-icons/fa';

export default function OAuthButtons() {
  const login = useAuthStore((s) => s.login);
  const { toast } = useToast();

  const handleMockOAuth = async (provider: 'google' | 'apple' | 'github') => {
    try {
      // simulate OAuth flow
      await new Promise((r) => setTimeout(r, 600));
      // create mock email from provider
      const email = `${provider}_user@example.com`;
      await login(email, 'oauth-placeholder-password');
      toast.success(`Signed in with ${provider}`, `Welcome, ${provider} user!`);
    } catch (err) {
      toast.error(`OAuth login failed`, `Unable to sign in with ${provider}.`);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Button
        onClick={() => handleMockOAuth('google')}
        aria-label="Sign in with Google"
        className="flex items-center justify-center gap-2 w-full bg-white border border-gray-300 text-gray-700 hover:shadow-md rounded-xl py-3"
      >
        <FaGoogle className="w-5 h-5" /> Sign in with Google
      </Button>
      <Button
        onClick={() => handleMockOAuth('apple')}
        aria-label="Sign in with Apple"
        className="flex items-center justify-center gap-2 w-full bg-black text-white hover:shadow-md rounded-xl py-3"
      >
        <FaApple className="w-5 h-5" /> Sign in with Apple
      </Button>
      <Button
        onClick={() => handleMockOAuth('github')}
        aria-label="Sign in with GitHub"
        className="flex items-center justify-center gap-2 w-full bg-gray-800 text-white hover:shadow-md rounded-xl py-3"
      >
        <FaGithub className="w-5 h-5" /> Sign in with GitHub
      </Button>
    </div>
  );
}
