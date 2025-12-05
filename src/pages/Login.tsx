// src/pages/Login.tsx

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/auth';
import OAuthButtons from '@/components/ui/OAuthButtons';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password too short'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const { addToast } = useToast();

  const { register, handleSubmit, formState } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      addToast({ title: 'Login successful', description: 'Welcome back!' });
      navigate('/'); // redirect after login
    } catch (err) {
      addToast({ title: 'Login failed', description: (err as any)?.message ?? 'An error occurred' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center py-20 px-4">
      <div className="flex justify-center mb-6">
        <img src="/src/assets/printelya logo.svg" alt="Printelya Logo" className="h-12" />
      </div>
      <div className="w-full max-w-md p-10 bg-white shadow-xl rounded-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">Sign in</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <Input
              {...register('email')}
              placeholder="you@example.com"
              aria-label="Email"
            />
            {formState.errors.email && <p className="text-red-500 text-sm mt-1">{formState.errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <Input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              aria-label="Password"
            />
            {formState.errors.password && <p className="text-red-500 text-sm mt-1">{formState.errors.password.message}</p>}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="my-6 text-center text-sm text-gray-500">Or continue with</div>
        <OAuthButtons />

        <div className="mt-6 text-sm text-center">
          <a className="text-blue-600 hover:underline" href="/reset-password">Forgot password?</a>
        </div>

        <div className="mt-4 text-sm text-center">
          Don’t have an account? <a className="text-blue-600 hover:underline" href="/register">Register</a>
        </div>
      </div>
    </div>
  );
}
