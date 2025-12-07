// src/pages/Login.tsx

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/auth';
import OAuthButtons from '@/components/ui/OAuthButtons';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password too short'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const { toast } = useToast();

  const { register, handleSubmit, formState } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!', 'Login successful');
      navigate('/'); // redirect after login
    } catch (err) {
      toast.error('Invalid email or password', 'Login failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center py-20 px-4 bg-background">
      <div className="flex justify-center mb-6">
        <img src="/src/assets/printelya logo.svg" alt="Printelya Logo" className="h-12" />
      </div>
      <div className="w-full max-w-md p-10 bg-surface shadow-luxury rounded-2xl border border-border">
        <h1 className="text-3xl font-bold text-center mb-6 text-text-primary">Sign in</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Email</label>
            <Input
              {...register('email')}
              placeholder="you@example.com"
              aria-label="Email"
            />
            {formState.errors.email && <p className="text-red-500 text-sm mt-1">{formState.errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Password</label>
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
            variant="default"
            className="w-full py-3"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="my-6 text-center text-sm text-text-primary/60">Or continue with</div>
        <OAuthButtons />

        <div className="mt-6 text-sm text-center">
          <a className="text-primary hover:text-primary-dark hover:underline font-medium transition" href="/reset-password">Forgot password?</a>
        </div>

        <div className="mt-4 text-sm text-center text-text-primary">
          Don't have an account? <a className="text-primary hover:text-primary-dark hover:underline font-semibold transition" href="/register">Register</a>
        </div>
      </div>
    </div>
  );
}
