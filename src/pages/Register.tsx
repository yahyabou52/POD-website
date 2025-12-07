// src/pages/Register.tsx

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/auth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import OAuthButtons from '@/components/ui/OAuthButtons';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name too short'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password too short'),
    confirm: z.string().min(6),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Passwords must match',
    path: ['confirm'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const register_user = useAuthStore((s) => s.register);
  const loading = useAuthStore((s) => s.loading);
  const { toast } = useToast();

  const { register: rf, handleSubmit, formState } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await register_user(data.name, data.email, data.password);
      toast.success('Account created successfully!', 'You can now log in');
      navigate('/');
    } catch (err) {
      toast.error('Registration failed', (err as any)?.message ?? 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center py-20 px-4 bg-background">
      <div className="flex justify-center mb-6">
        <img src="/src/assets/printelya logo.svg" alt="Printelya Logo" className="h-12" />
      </div>
      <div className="w-full max-w-md p-10 bg-surface shadow-luxury rounded-2xl border border-border">
        <h1 className="text-3xl font-bold text-center mb-6 text-text-primary">Create account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Name</label>
            <Input
              {...rf('name')}
              placeholder="Your name"
            />
            {formState.errors.name && <p className="text-red-500 text-sm mt-1">{formState.errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Email</label>
            <Input
              {...rf('email')}
              placeholder="you@example.com"
            />
            {formState.errors.email && <p className="text-red-500 text-sm mt-1">{formState.errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Password</label>
            <Input
              {...rf('password')}
              type="password"
              placeholder="••••••••"
            />
            {formState.errors.password && <p className="text-red-500 text-sm mt-1">{formState.errors.password.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Confirm Password</label>
            <Input
              {...rf('confirm')}
              type="password"
              placeholder="••••••••"
            />
            {formState.errors.confirm && <p className="text-red-500 text-sm mt-1">{formState.errors.confirm.message}</p>}
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="default"
            className="w-full py-3"
          >
            {loading ? 'Creating...' : 'Create account'}
          </Button>
        </form>

        <div className="mt-6 text-sm text-center text-text-primary">
          Already have an account?{' '}
          <a className="text-primary hover:text-primary-dark hover:underline font-semibold transition" href="/login">
            Sign in
          </a>
        </div>

        <div className="mt-8">
          <OAuthButtons />
        </div>
      </div>
    </div>
  );
}
