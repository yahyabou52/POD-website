// src/pages/Register.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/auth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { LockClosedIcon, UserIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import { FaApple, FaGoogle, FaGithub } from 'react-icons/fa';
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
  const register = useAuthStore((s) => s.register);
  const loading = useAuthStore((s) => s.loading);
  const { toast } = useToast();

  const { register: rf, handleSubmit, formState } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await register(data.name, data.email, data.password);
      toast({ title: 'Registration successful', description: 'You can now log in!', status: 'success' });
      navigate('/');
    } catch (err) {
      toast({ title: 'Registration failed', description: (err as any)?.message ?? 'An error occurred', status: 'error' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center py-20 px-4">
      <div className="flex justify-center mb-6">
        <img src="/src/assets/printelya logo.svg" alt="Printelya Logo" className="h-12" />
      </div>
      <div className="w-full max-w-md p-10 bg-white shadow-xl rounded-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">Create account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <Input
              {...rf('name')}
              placeholder="Your name"
              icon={<UserIcon className="w-5 h-5 text-gray-400" />}
            />
            {formState.errors.name && <p className="text-red-500 text-sm mt-1">{formState.errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <Input
              {...rf('email')}
              placeholder="you@example.com"
              icon={<EnvelopeIcon className="w-5 h-5 text-gray-400" />}
            />
            {formState.errors.email && <p className="text-red-500 text-sm mt-1">{formState.errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <Input
              {...rf('password')}
              type="password"
              placeholder="••••••••"
              icon={<LockClosedIcon className="w-5 h-5 text-gray-400" />}
            />
            {formState.errors.password && <p className="text-red-500 text-sm mt-1">{formState.errors.password.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Confirm Password</label>
            <Input
              {...rf('confirm')}
              type="password"
              placeholder="••••••••"
              icon={<LockClosedIcon className="w-5 h-5 text-gray-400" />}
            />
            {formState.errors.confirm && <p className="text-red-500 text-sm mt-1">{formState.errors.confirm.message}</p>}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2"
          >
            {loading ? 'Creating...' : 'Create account'}
          </Button>
        </form>

        <div className="mt-6 text-sm text-center">
          Already have an account?{' '}
          <a className="text-blue-600 hover:underline" href="/login">
            Sign in
          </a>
        </div>

        <div className="mt-8">
          <OAuthButtons
            providers={[{
              name: 'Google',
              icon: <FaGoogle className="w-5 h-5" />
            }, {
              name: 'Apple',
              icon: <FaApple className="w-5 h-5" />
            }, {
              name: 'GitHub',
              icon: <FaGithub className="w-5 h-5" />
            }]}
          />
        </div>
      </div>
    </div>
  );
}
