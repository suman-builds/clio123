'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Stethoscope, Mail, KeyRound, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { signIn } from '@/lib/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const { data: authData, error } = await signIn(data.email, data.password);
      
      if (error) {
        setAuthError(error.message);
        throw error;
      }
      
      toast.success('Logged in successfully');
      router.push('/dashboard');
      router.refresh();
      
  console.log(authData, "tauthDataestsss")
    } catch (error: any) {
      console.error('Login error:', error);
      setAuthError(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-pink-50 p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-xl border-0">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-blue-600 to-pink-600 p-3 rounded-xl">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {authError && (
              <Alert variant="destructive" className="bg-red-50 text-red-800 border border-red-200">
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  placeholder="name@example.com"
                  className="pl-10"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  {...register('password')}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            <p className="text-sm text-center text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign up
              </Link>
            </p>
            
            {/* Demo accounts for testing */}
            <div className="mt-6 border-t pt-4">
              <p className="text-sm text-center text-gray-500 mb-2">Demo Accounts</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    const form = document.querySelector('form') as HTMLFormElement;
                    const emailInput = form.querySelector('#email') as HTMLInputElement;
                    const passwordInput = form.querySelector('#password') as HTMLInputElement;
                    
                    emailInput.value = 'admin@clinic.com';
                    passwordInput.value = 'admin123';
                    
                    form.requestSubmit();
                  }}
                >
                  Admin
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    const form = document.querySelector('form') as HTMLFormElement;
                    const emailInput = form.querySelector('#email') as HTMLInputElement;
                    const passwordInput = form.querySelector('#password') as HTMLInputElement;
                    
                    emailInput.value = 'doctor@clinic.com';
                    passwordInput.value = 'doctor123';
                    
                    form.requestSubmit();
                  }}
                >
                  Doctor
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    const form = document.querySelector('form') as HTMLFormElement;
                    const emailInput = form.querySelector('#email') as HTMLInputElement;
                    const passwordInput = form.querySelector('#password') as HTMLInputElement;
                    
                    emailInput.value = 'support@clinic.com';
                    passwordInput.value = 'support123';
                    
                    form.requestSubmit();
                  }}
                >
                  Support
                </Button>
              </div>
            </div>
            
            {/* Setup Instructions */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="text-sm font-medium text-blue-800 mb-2">First Time Setup</h3>
              <p className="text-xs text-blue-700 mb-2">
                Before logging in, you need to create the demo users in Supabase:
              </p>
              <ol className="text-xs text-blue-700 list-decimal pl-4 space-y-1">
                <li>Go to your Supabase dashboard</li>
                <li>Navigate to Authentication &gt; Users</li>
                <li>Create users with the emails and passwords shown above</li>
                <li>Set the User IDs as specified in ADMIN_SETUP_INSTRUCTIONS.md</li>
              </ol>
              <p className="text-xs text-blue-700 mt-2">
                See ADMIN_SETUP_INSTRUCTIONS.md for detailed steps.
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}