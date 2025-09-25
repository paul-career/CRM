import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { LogIn, Building2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.email || !formData.password || !formData.role) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    const result = login(formData);
    
    if (!result.success) {
      toast({
        title: result.error || "Login failed",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const fillExampleCredentials = (role) => {
    const credentials = {
      'super-admin': { email: 'admin@crm.com', password: 'admin123' },
      lead: { email: 'lead@crm.com', password: 'lead123' },
      agent: { email: 'agent@crm.com', password: 'agent123' }
    };
    
    const cred = credentials[role];
    if (cred) {
      setFormData({
        email: cred.email,
        password: cred.password,
        role: role
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - Call 360 Lead Management System</title>
        <meta name="description" content="Access your Call 360 dashboard to manage leads, clients, and sales activities. Secure login for Admin, Sales Team, and User roles." />
        <meta property="og:title" content="Login - Call 360 Lead Management System" />
        <meta property="og:description" content="Access your Call 360 dashboard to manage leads, clients, and sales activities. Secure login for Admin, Sales Team, and User roles." />
      </Helmet>

      <div className="min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center max-w-md"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Building2 className="w-12 h-12 text-white" />
            </div>
            <span className="text-5xl font-bold text-white mb-4 block">Call 360</span>
            <p className="text-xl text-slate-300 mb-8">Lead Management System</p>
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-slate-300">Manage leads and track sales</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-slate-300">Real-time analytics and reports</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-slate-300">Team collaboration tools</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-12">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-md"
          >
            {/* Mobile Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8 lg:hidden"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <span className="text-3xl font-bold text-white">Call 360</span>
              <p className="text-slate-400 mt-2">Lead Management System</p>
            </motion.div>

            {/* Login Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-effect rounded-2xl p-8"
            >
            <div className="text-center mb-6">
              <span className="text-2xl font-bold text-white">Welcome Back</span>
              <p className="text-slate-400 mt-2">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-slate-300">Role</Label>
                <Select value={formData.role} onValueChange={(value) => handleChange('role', value)}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="super-admin">Super Admin</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </div>
                )}
              </Button>
            </form>

            {/* Example Credentials */}
            <div className="mt-8 pt-6 border-t border-slate-700">
              <p className="text-slate-400 text-sm mb-4 text-center">Try example credentials:</p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillExampleCredentials('super-admin')}
                  className="text-xs border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Super Admin
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillExampleCredentials('lead')}
                  className="text-xs border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Lead
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillExampleCredentials('agent')}
                  className="text-xs border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Agent
                </Button>
              </div>
            </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
