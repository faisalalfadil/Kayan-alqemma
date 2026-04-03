'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Lock,
  User,
  LogOut,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Settings,
  KeyRound,
  UserCog,
  ChevronLeft,
  Phone,
  Smartphone,
  HelpCircle,
  ArrowRight,
  Undo2,
  FileText,
  Sparkles,
  Trash2,
  Pencil,
  Send,
  Plus,
  Globe,
  FileEdit,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

type PageState = 'loading' | 'setup' | 'login' | 'forgot' | 'dashboard';

interface AdminInfo {
  id: string;
  username: string;
  phone1: string | null;
  phone2: string | null;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

type ArticleView = 'list' | 'generate' | 'edit' | 'write';

const SECURITY_QUESTIONS = [
  'ما هو اسم مدينتك المفضلة؟',
  'ما هو اسم أول مدرسة التحقت بها؟',
  'ما هو اسم حيوانك الأليف الأول؟',
  'ما هي سيارتك الأولى؟',
  'ما هو لونك المفضل؟',
  'ما هو اسم صديقك المقرب؟',
  'في أي مدينة ولدت؟',
  'ما هو اسم فيلمك المفضل؟',
];

export default function Home() {
  const [pageState, setPageState] = useState<PageState>('loading');
  const [admin, setAdmin] = useState<AdminInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Setup form
  const [setupUsername, setSetupUsername] = useState('');
  const [setupPassword, setSetupPassword] = useState('');
  const [setupConfirmPassword, setSetupConfirmPassword] = useState('');
  const [setupSecurityQuestion, setSetupSecurityQuestion] = useState('');
  const [setupSecurityAnswer, setSetupSecurityAnswer] = useState('');

  // Login form
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Forgot password form
  const [forgotUsername, setForgotUsername] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Change password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [changeNewPassword, setChangeNewPassword] = useState('');
  const [changeConfirmPassword, setChangeConfirmPassword] = useState('');

  // Change username form
  const [newUsername, setNewUsername] = useState('');
  const [usernamePassword, setUsernamePassword] = useState('');

  // Phones form
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [phonesPassword, setPhonesPassword] = useState('');

  // Articles state
  const [articles, setArticles] = useState<Article[]>([]);
  const [articleView, setArticleView] = useState<ArticleView>('list');
  const [articleLoading, setArticleLoading] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  // AI Generate form
  const [aiTopic, setAiTopic] = useState('');
  const [aiTone, setAiTone] = useState('professional');
  const [aiLength, setAiLength] = useState('medium');

  // Write/Edit form
  const [articleTitle, setArticleTitle] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [articleExcerpt, setArticleExcerpt] = useState('');

  // Show/hide password
  const [showSetupPassword, setShowSetupPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showChangeNewPassword, setShowChangeNewPassword] = useState(false);
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);

  const { toast } = useToast();

  const checkAuth = useCallback(async () => {
    try {
      const setupRes = await fetch('/api/auth/setup');
      const setupData = await setupRes.json();

      if (setupData.isSetup) {
        setPageState('setup');
        return;
      }

      const meRes = await fetch('/api/auth/me');
      if (meRes.ok) {
        const meData = await meRes.json();
        setAdmin(meData.admin);
        setPhone1(meData.admin.phone1 || '');
        setPhone2(meData.admin.phone2 || '');
        setPageState('dashboard');
      } else {
        setPageState('login');
      }
    } catch {
      setPageState('login');
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ============ ARTICLES ============
  const fetchArticles = useCallback(async () => {
    try {
      const res = await fetch('/api/articles');
      if (res.ok) {
        const data = await res.json();
        setArticles(data.articles);
      }
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    if (pageState === 'dashboard') {
      fetchArticles();
    }
  }, [pageState, fetchArticles]);

  const handleGenerateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;
    setArticleLoading(true);
    try {
      const res = await fetch('/api/articles/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: aiTopic, tone: aiTone, length: aiLength }),
      });
      const data = await res.json();
      if (res.ok) {
        setArticleTitle(data.title);
        setArticleContent(data.content);
        setArticleExcerpt(data.excerpt);
        setEditingArticle(null);
        setArticleView('write');
        toast({ title: 'تم التوليد!', description: 'تم إنشاء المقال بنجاح. راجعه واحفظه.' });
      } else {
        toast({ title: 'خطأ', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'خطأ', description: 'حدث خطأ في الاتصال', variant: 'destructive' });
    } finally {
      setArticleLoading(false);
    }
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleTitle.trim()) {
      toast({ title: 'خطأ', description: 'عنوان المقال مطلوب', variant: 'destructive' });
      return;
    }
    setArticleLoading(true);
    try {
      let res;
      if (editingArticle) {
        res = await fetch(`/api/articles/${editingArticle.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: articleTitle, content: articleContent, excerpt: articleExcerpt }),
        });
      } else {
        res = await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: articleTitle, content: articleContent, excerpt: articleExcerpt }),
        });
      }
      const data = await res.json();
      if (res.ok) {
        toast({ title: 'تم بنجاح!', description: editingArticle ? 'تم تحديث المقال' : 'تم حفظ المقال' });
        resetArticleForm();
        setArticleView('list');
        fetchArticles();
      } else {
        toast({ title: 'خطأ', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'خطأ', description: 'حدث خطأ في الاتصال', variant: 'destructive' });
    } finally {
      setArticleLoading(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return;
    setArticleLoading(true);
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast({ title: 'تم الحذف', description: 'تم حذف المقال بنجاح' });
        fetchArticles();
      } else {
        const data = await res.json();
        toast({ title: 'خطأ', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'خطأ', description: 'حدث خطأ في الاتصال', variant: 'destructive' });
    } finally {
      setArticleLoading(false);
    }
  };

  const handleTogglePublish = async (id: string, currentPublished: boolean) => {
    try {
      const res = await fetch(`/api/articles/${id}/publish`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentPublished }),
      });
      if (res.ok) {
        toast({ title: 'تم!', description: currentPublished ? 'تم إلغاء النشر' : 'تم نشر المقال' });
        fetchArticles();
      }
    } catch {
      toast({ title: 'خطأ', description: 'حدث خطأ', variant: 'destructive' });
    }
  };

  const handleEditArticle = async (id: string) => {
    setArticleLoading(true);
    try {
      const res = await fetch(`/api/articles/${id}`);
      if (res.ok) {
        const data = await res.json();
        setEditingArticle(data.article);
        setArticleTitle(data.article.title);
        setArticleContent(data.article.content);
        setArticleExcerpt(data.article.excerpt);
        setArticleView('edit');
      }
    } catch {
      toast({ title: 'خطأ', description: 'حدث خطأ في الاتصال', variant: 'destructive' });
    } finally {
      setArticleLoading(false);
    }
  };

  const resetArticleForm = () => {
    setArticleTitle('');
    setArticleContent('');
    setArticleExcerpt('');
    setEditingArticle(null);
    setAiTopic('');
    setAiTone('professional');
    setAiLength('medium');
  };

  // ============ SETUP ============
  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (setupPassword !== setupConfirmPassword) {
      toast({ title: 'خطأ', description: 'كلمات المرور غير متطابقة', variant: 'destructive' });
      return;
    }

    if (setupPassword.length < 6) {
      toast({ title: 'خطأ', description: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل', variant: 'destructive' });
      return;
    }

    if (!setupSecurityQuestion) {
      toast({ title: 'خطأ', description: 'اختر سؤالاً أمنياً', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: setupUsername,
          password: setupPassword,
          securityQuestion: setupSecurityQuestion,
          securityAnswer: setupSecurityAnswer,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast({ title: 'تم بنجاح!', description: 'تم إنشاء الحساب. يمكنك الآن تسجيل الدخول.' });
        setPageState('login');
      } else {
        toast({ title: 'خطأ', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'خطأ', description: 'حدث خطأ في الاتصال', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // ============ LOGIN ============
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setAdmin(data.admin);
        setPhone1(data.admin.phone1 || '');
        setPhone2(data.admin.phone2 || '');
        setPageState('dashboard');
        toast({ title: 'مرحباً!', description: 'تم تسجيل الدخول بنجاح' });
      } else {
        toast({ title: 'خطأ', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'خطأ', description: 'حدث خطأ في الاتصال', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // ============ FORGOT PASSWORD - STEP 1 ============
  const handleGetSecurityQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`/api/auth/forgot-password?username=${encodeURIComponent(forgotUsername)}`);
      const data = await res.json();

      if (res.ok) {
        setSecurityQuestion(data.question);
      } else {
        toast({ title: 'خطأ', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'خطأ', description: 'حدث خطأ في الاتصال', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // ============ FORGOT PASSWORD - STEP 2 ============
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast({ title: 'خطأ', description: 'كلمات المرور غير متطابقة', variant: 'destructive' });
      return;
    }

    if (newPassword.length < 6) {
      toast({ title: 'خطأ', description: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: forgotUsername,
          securityAnswer,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast({ title: 'تم بنجاح!', description: 'تم تغيير كلمة المرور. يمكنك تسجيل الدخول الآن.' });
        setPageState('login');
        setLoginUsername(forgotUsername);
        setLoginPassword('');
        setForgotUsername('');
        setSecurityQuestion('');
        setSecurityAnswer('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        toast({ title: 'خطأ', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'خطأ', description: 'حدث خطأ في الاتصال', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // ============ CHANGE PASSWORD ============
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (changeNewPassword !== changeConfirmPassword) {
      toast({ title: 'خطأ', description: 'كلمات المرور الجديدة غير متطابقة', variant: 'destructive' });
      return;
    }

    if (changeNewPassword.length < 6) {
      toast({ title: 'خطأ', description: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword: changeNewPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        toast({ title: 'تم بنجاح!', description: 'تم تغيير كلمة المرور' });
        setCurrentPassword('');
        setChangeNewPassword('');
        setChangeConfirmPassword('');
      } else {
        toast({ title: 'خطأ', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'خطأ', description: 'حدث خطأ في الاتصال', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // ============ CHANGE USERNAME ============
  const handleChangeUsername = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newUsername.length < 3) {
      toast({ title: 'خطأ', description: 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/change-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newUsername, password: usernamePassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setAdmin({ ...admin!, username: newUsername });
        toast({ title: 'تم بنجاح!', description: 'تم تغيير اسم المستخدم' });
        setNewUsername('');
        setUsernamePassword('');
      } else {
        toast({ title: 'خطأ', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'خطأ', description: 'حدث خطأ في الاتصال', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // ============ SAVE PHONES ============
  const handleSavePhones = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone1 && !phone2) {
      toast({ title: 'تنبيه', description: 'أدخل رقم جوال واحد على الأقل', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/phones', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone1, phone2, password: phonesPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setAdmin({ ...admin!, phone1: phone1 || null, phone2: phone2 || null });
        toast({ title: 'تم بنجاح!', description: 'تم حفظ أرقام الجوال' });
        setPhonesPassword('');
      } else {
        toast({ title: 'خطأ', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'خطأ', description: 'حدث خطأ في الاتصال', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // ============ LOGOUT ============
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setAdmin(null);
      setPageState('login');
      setLoginUsername('');
      setLoginPassword('');
      toast({ title: 'تم تسجيل الخروج' });
    } catch {
      toast({ title: 'خطأ', description: 'حدث خطأ', variant: 'destructive' });
    }
  };

  // ============ PASSWORD INPUT WITH TOGGLE ============
  const PasswordInput = ({
    id,
    value,
    onChange,
    placeholder,
    show,
    onToggleShow,
    required = true,
    minLength,
    className = '',
  }: {
    id: string;
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    show: boolean;
    onToggleShow: () => void;
    required?: boolean;
    minLength?: number;
    className?: string;
  }) => (
    <div className="relative">
      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <Input
        id={id}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`pr-10 pl-10 ${className}`}
        required={required}
        minLength={minLength}
      />
      <button
        type="button"
        onClick={onToggleShow}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );

  // ============ LOADING STATE ============
  if (pageState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
          <p className="text-slate-500 text-sm">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // ============ SETUP PAGE ============
  if (pageState === 'setup') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-emerald-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-800">إعداد الحساب</CardTitle>
              <CardDescription className="text-slate-500 mt-2">
                قم بإنشاء حساب المسؤول الأول
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSetup} className="space-y-4">
                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="setup-username">اسم المستخدم</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="setup-username"
                      placeholder="أدخل اسم المستخدم"
                      value={setupUsername}
                      onChange={(e) => setSetupUsername(e.target.value)}
                      className="pr-10"
                      required
                      minLength={3}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="setup-password">كلمة المرور</Label>
                  <PasswordInput
                    id="setup-password"
                    value={setupPassword}
                    onChange={setSetupPassword}
                    placeholder="6 أحرف على الأقل"
                    show={showSetupPassword}
                    onToggleShow={() => setShowSetupPassword(!showSetupPassword)}
                    minLength={6}
                  />
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="setup-confirm">تأكيد كلمة المرور</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="setup-confirm"
                      type={showSetupPassword ? 'text' : 'password'}
                      placeholder="أعد كتابة كلمة المرور"
                      value={setupConfirmPassword}
                      onChange={(e) => setSetupConfirmPassword(e.target.value)}
                      className="pr-10"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <Separator />

                {/* Security Question */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-amber-500" />
                    السؤال الأمني
                  </Label>
                  <Select value={setupSecurityQuestion} onValueChange={setSetupSecurityQuestion} required>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر سؤالاً أمنياً" />
                    </SelectTrigger>
                    <SelectContent>
                      {SECURITY_QUESTIONS.map((q) => (
                        <SelectItem key={q} value={q}>{q}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-400">يُستخدم لاستعادة كلمة المرور إذا نسيتها</p>
                </div>

                {/* Security Answer */}
                <div className="space-y-2">
                  <Label htmlFor="setup-answer">الإجابة الأمنية</Label>
                  <div className="relative">
                    <HelpCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="setup-answer"
                      placeholder="أدخل إجابتك"
                      value={setupSecurityAnswer}
                      onChange={(e) => setSetupSecurityAnswer(e.target.value)}
                      className="pr-10"
                      required
                      minLength={2}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-11"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5 ml-2" />
                      إنشاء الحساب
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // ============ FORGOT PASSWORD PAGE ============
  if (pageState === 'forgot') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
                <Undo2 className="h-8 w-8 text-amber-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-800">استعادة كلمة المرور</CardTitle>
              <CardDescription className="text-slate-500 mt-2">
                أجب على السؤال الأمني لتغيير كلمة المرور
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!securityQuestion ? (
                /* Step 1: Enter username */
                <form onSubmit={handleGetSecurityQuestion} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forgot-username">اسم المستخدم</Label>
                    <div className="relative">
                      <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="forgot-username"
                        placeholder="أدخل اسم المستخدم"
                        value={forgotUsername}
                        onChange={(e) => setForgotUsername(e.target.value)}
                        className="pr-10"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold h-11"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <ArrowRight className="h-5 w-5 ml-2" />
                        التالي
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-slate-500 hover:text-slate-700"
                    onClick={() => { setPageState('login'); setForgotUsername(''); }}
                  >
                    <ChevronLeft className="h-4 w-4 ml-1" />
                    العودة لتسجيل الدخول
                  </Button>
                </form>
              ) : (
                /* Step 2: Answer question + new password */
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-sm font-medium text-amber-800 mb-1">السؤال الأمني:</p>
                    <p className="text-base font-semibold text-slate-800">{securityQuestion}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="security-answer">الإجابة</Label>
                    <div className="relative">
                      <HelpCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="security-answer"
                        placeholder="أدخل إجابتك"
                        value={securityAnswer}
                        onChange={(e) => setSecurityAnswer(e.target.value)}
                        className="pr-10"
                        required
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="forgot-new-pass">كلمة المرور الجديدة</Label>
                    <PasswordInput
                      id="forgot-new-pass"
                      value={newPassword}
                      onChange={setNewPassword}
                      placeholder="6 أحرف على الأقل"
                      show={showForgotNewPassword}
                      onToggleShow={() => setShowForgotNewPassword(!showForgotNewPassword)}
                      minLength={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="forgot-confirm-pass">تأكيد كلمة المرور الجديدة</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="forgot-confirm-pass"
                        type={showForgotNewPassword ? 'text' : 'password'}
                        placeholder="أعد كتابة كلمة المرور"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="pr-10"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-11"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="h-5 w-5 ml-2" />
                        تغيير كلمة المرور
                      </>
                    )}
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex-1 text-slate-500 hover:text-slate-700"
                      onClick={() => { setSecurityQuestion(''); setSecurityAnswer(''); }}
                    >
                      العودة
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex-1 text-slate-500 hover:text-slate-700"
                      onClick={() => {
                        setPageState('login');
                        setForgotUsername('');
                        setSecurityQuestion('');
                        setSecurityAnswer('');
                        setNewPassword('');
                        setConfirmNewPassword('');
                      }}
                    >
                      تسجيل الدخول
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // ============ LOGIN PAGE ============
  if (pageState === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-emerald-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-800">تسجيل الدخول</CardTitle>
              <CardDescription className="text-slate-500 mt-2">
                لوحة تحكم شركة كيان القمة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-username">اسم المستخدم</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="login-username"
                      placeholder="أدخل اسم المستخدم"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      className="pr-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">كلمة المرور</Label>
                  <PasswordInput
                    id="login-password"
                    value={loginPassword}
                    onChange={setLoginPassword}
                    placeholder="أدخل كلمة المرور"
                    show={showLoginPassword}
                    onToggleShow={() => setShowLoginPassword(!showLoginPassword)}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-11"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <ChevronLeft className="h-5 w-5 ml-2" />
                      تسجيل الدخول
                    </>
                  )}
                </Button>
              </form>
              <div className="mt-4">
                <Button
                  variant="link"
                  className="w-full text-amber-600 hover:text-amber-700 text-sm"
                  onClick={() => setPageState('forgot')}
                >
                  <Undo2 className="h-4 w-4 ml-1" />
                  نسيت كلمة المرور؟
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // ============ DASHBOARD ============
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Shield className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800">لوحة التحكم</h1>
                <p className="text-xs text-slate-400">شركة كيان القمة</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg">
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {admin?.username?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-700">{admin?.username}</span>
                  <span className="text-[10px] text-slate-400">مسؤول</span>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-slate-500 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 ml-1" />
                <span className="hidden sm:inline">خروج</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">مرحباً، {admin?.username} 👋</h2>
          <p className="text-slate-500 mt-1">إدارة حسابك وإعداداتك من هنا</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <UserCog className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">اسم المستخدم</p>
                    <p className="font-semibold text-slate-800">{admin?.username}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">الصلاحية</p>
                    <p className="font-semibold text-slate-800">مسؤول النظام</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                    <Phone className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">الرقم الرئيسي</p>
                    <p className="font-semibold text-slate-800" dir="ltr">{admin?.phone1 || 'غير محدد'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">الرقم الثاني</p>
                    <p className="font-semibold text-slate-800" dir="ltr">{admin?.phone2 || 'غير محدد'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Settings Tabs */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                <Settings className="h-5 w-5 text-emerald-600" />
                إعدادات الحساب
              </CardTitle>
              <CardDescription>تغيير اسم المستخدم وكلمة المرور وأرقام الجوال</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="phones" dir="rtl">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="phones" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                    <Phone className="h-4 w-4 ml-2" />
                    <span className="hidden sm:inline">أرقام الجوال</span>
                    <span className="sm:hidden">الأرقام</span>
                  </TabsTrigger>
                  <TabsTrigger value="username" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                    <UserCog className="h-4 w-4 ml-2" />
                    <span className="hidden sm:inline">اسم المستخدم</span>
                    <span className="sm:hidden">اليوزرنيم</span>
                  </TabsTrigger>
                  <TabsTrigger value="password" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                    <KeyRound className="h-4 w-4 ml-2" />
                    <span className="hidden sm:inline">كلمة المرور</span>
                    <span className="sm:hidden">المرور</span>
                  </TabsTrigger>
                </TabsList>

                {/* PHONES TAB */}
                <TabsContent value="phones">
                  <div className="max-w-md mx-auto">
                    <div className="bg-slate-50 rounded-xl p-5 mb-6">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
                        <p className="text-sm text-slate-600">يمكنك إضافة رقم جوال رئيسي ورقم ثاني. أدخل كلمة المرور للتحقق عند الحفظ.</p>
                      </div>
                    </div>
                    {(admin?.phone1 || admin?.phone2) && (
                      <div className="space-y-3 mb-6">
                        <h4 className="text-sm font-medium text-slate-600">الأرقام الحالية</h4>
                        {admin?.phone1 && (
                          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-emerald-600" />
                              <span className="text-sm font-medium text-slate-700">الرئيسي</span>
                            </div>
                            <span className="text-sm font-semibold text-slate-800" dir="ltr">{admin.phone1}</span>
                          </div>
                        )}
                        {admin?.phone2 && (
                          <div className="flex items-center justify-between bg-violet-50 border border-violet-200 rounded-lg px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Smartphone className="h-4 w-4 text-violet-600" />
                              <span className="text-sm font-medium text-slate-700">الثاني</span>
                            </div>
                            <span className="text-sm font-semibold text-slate-800" dir="ltr">{admin.phone2}</span>
                          </div>
                        )}
                      </div>
                    )}
                    <form onSubmit={handleSavePhones} className="space-y-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-emerald-500" />
                          الرقم الرئيسي
                        </Label>
                        <Input placeholder="05XXXXXXXX أو +9665XXXXXXXX" value={phone1} onChange={(e) => setPhone1(e.target.value)} dir="ltr" className="text-left" />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-violet-500" />
                          الرقم الثاني (اختياري)
                        </Label>
                        <Input placeholder="05XXXXXXXX أو +9665XXXXXXXX" value={phone2} onChange={(e) => setPhone2(e.target.value)} dir="ltr" className="text-left" />
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <Label>كلمة المرور (للتحقق)</Label>
                        <PasswordInput
                          id="phones-pass"
                          value={phonesPassword}
                          onChange={setPhonesPassword}
                          placeholder="أدخل كلمة المرور"
                          show={false}
                          onToggleShow={() => {}}
                        />
                      </div>
                      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-11" disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><CheckCircle2 className="h-5 w-5 ml-2" />حفظ أرقام الجوال</>}
                      </Button>
                    </form>
                  </div>
                </TabsContent>

                {/* USERNAME TAB */}
                <TabsContent value="username">
                  <div className="max-w-md mx-auto">
                    <div className="bg-slate-50 rounded-xl p-5 mb-6">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
                        <p className="text-sm text-slate-600">لتغيير اسم المستخدم يجب إدخال كلمة المرور الحالية</p>
                      </div>
                    </div>
                    <form onSubmit={handleChangeUsername} className="space-y-4">
                      <div className="space-y-2">
                        <Label>اسم المستخدم الجديد</Label>
                        <div className="relative">
                          <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input placeholder="3 أحرف على الأقل" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="pr-10" required minLength={3} />
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <Label>كلمة المرور الحالية</Label>
                        <PasswordInput
                          id="username-pass"
                          value={usernamePassword}
                          onChange={setUsernamePassword}
                          placeholder="أدخل كلمة المرور للتحقق"
                          show={false}
                          onToggleShow={() => {}}
                        />
                      </div>
                      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-11" disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><CheckCircle2 className="h-5 w-5 ml-2" />حفظ التغييرات</>}
                      </Button>
                    </form>
                  </div>
                </TabsContent>

                {/* PASSWORD TAB */}
                <TabsContent value="password">
                  <div className="max-w-md mx-auto">
                    <div className="bg-slate-50 rounded-xl p-5 mb-6">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
                        <p className="text-sm text-slate-600">تأكد من استخدام كلمة مرور قوية تحتوي على أحرف وأرقام</p>
                      </div>
                    </div>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label>كلمة المرور الحالية</Label>
                        <PasswordInput
                          id="current-pass"
                          value={currentPassword}
                          onChange={setCurrentPassword}
                          placeholder="أدخل كلمة المرور الحالية"
                          show={showCurrentPassword}
                          onToggleShow={() => setShowCurrentPassword(!showCurrentPassword)}
                        />
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <Label>كلمة المرور الجديدة</Label>
                        <PasswordInput
                          id="new-pass"
                          value={changeNewPassword}
                          onChange={setChangeNewPassword}
                          placeholder="6 أحرف على الأقل"
                          show={showChangeNewPassword}
                          onToggleShow={() => setShowChangeNewPassword(!showChangeNewPassword)}
                          minLength={6}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>تأكيد كلمة المرور الجديدة</Label>
                        <div className="relative">
                          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            type={showChangeNewPassword ? 'text' : 'password'}
                            placeholder="أعد كتابة كلمة المرور"
                            value={changeConfirmPassword}
                            onChange={(e) => setChangeConfirmPassword(e.target.value)}
                            className="pr-10"
                            required
                            minLength={6}
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-11" disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><CheckCircle2 className="h-5 w-5 ml-2" />تغيير كلمة المرور</>}
                      </Button>
                    </form>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Articles Section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-8">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-emerald-600" />
                    إدارة المقالات
                  </CardTitle>
                  <CardDescription>إنشاء وتحرير ونشر المقالات بمساعدة الذكاء الاصطناعي</CardDescription>
                </div>
                {articleView === 'list' && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => { resetArticleForm(); setArticleView('write'); }} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      <Plus className="h-4 w-4 ml-1" />
                      كتابة مقال
                    </Button>
                    <Button size="sm" onClick={() => { resetArticleForm(); setArticleView('generate'); }} className="bg-violet-600 hover:bg-violet-700 text-white">
                      <Sparkles className="h-4 w-4 ml-1" />
                      توليد بالذكاء الاصطناعي
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {/* LIST VIEW */}
              {articleView === 'list' && (
                <div>
                  {articles.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-8 w-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">لا توجد مقالات بعد</h3>
                      <p className="text-slate-500 text-sm mb-6">ابدأ بكتابة مقال جديد أو استخدم الذكاء الاصطناعي لتوليد محتوى</p>
                      <div className="flex gap-2 justify-center">
                        <Button size="sm" onClick={() => { resetArticleForm(); setArticleView('write'); }} variant="outline">
                          <Pencil className="h-4 w-4 ml-1" />
                          كتابة يدوية
                        </Button>
                        <Button size="sm" onClick={() => { resetArticleForm(); setArticleView('generate'); }} className="bg-violet-600 hover:bg-violet-700 text-white">
                          <Sparkles className="h-4 w-4 ml-1" />
                          توليد بالذكاء الاصطناعي
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {articles.map((article) => (
                        <div key={article.id} className="flex items-start justify-between gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-slate-800 truncate">{article.title}</h4>
                              {article.published ? (
                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs">
                                  <Globe className="h-3 w-3 ml-1" />
                                  منشور
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="text-xs">
                                  مسودة
                                </Badge>
                              )}
                            </div>
                            {article.excerpt && (
                              <p className="text-sm text-slate-500 line-clamp-1 mb-2">{article.excerpt}</p>
                            )}
                            <p className="text-xs text-slate-400">
                              {new Date(article.createdAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleTogglePublish(article.id, article.published)} title={article.published ? 'إلغاء النشر' : 'نشر'}>
                              {article.published ? <EyeOff className="h-4 w-4 text-amber-500" /> : <Globe className="h-4 w-4 text-emerald-500" />}
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEditArticle(article.id)} title="تعديل">
                              <Pencil className="h-4 w-4 text-blue-500" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleDeleteArticle(article.id)} title="حذف">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* GENERATE VIEW */}
              {articleView === 'generate' && (
                <div className="max-w-lg mx-auto">
                  <Button variant="ghost" size="sm" onClick={() => { resetArticleForm(); setArticleView('list'); }} className="mb-4">
                    <ChevronLeft className="h-4 w-4 ml-1" />
                    العودة للمقالات
                  </Button>
                  <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-5 mb-6 border border-violet-100">
                    <div className="flex items-center gap-3 mb-2">
                      <Sparkles className="h-5 w-5 text-violet-600" />
                      <h3 className="font-semibold text-violet-800">توليد مقال بالذكاء الاصطناعي</h3>
                    </div>
                    <p className="text-sm text-violet-600">أدخل موضوع المقال وسيقوم الذكاء الاصطناعي بكتابته بالكامل</p>
                  </div>
                  <form onSubmit={handleGenerateArticle} className="space-y-4">
                    <div className="space-y-2">
                      <Label>موضوع المقال</Label>
                      <Textarea
                        placeholder="مثال: أهمية المظلات الكهربائية في المملكة العربية السعودية"
                        value={aiTopic}
                        onChange={(e) => setAiTopic(e.target.value)}
                        rows={3}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>أسلوب الكتابة</Label>
                        <Select value={aiTone} onValueChange={setAiTone}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professional">مهني ورسمي</SelectItem>
                            <SelectItem value="casual">ودي وسلس</SelectItem>
                            <SelectItem value="educational">تعليمي</SelectItem>
                            <SelectItem value="marketing">تسويقي</SelectItem>
                            <SelectItem value="technical">تقني</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>طول المقال</Label>
                        <Select value={aiLength} onValueChange={setAiLength}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="short">قصير</SelectItem>
                            <SelectItem value="medium">متوسط</SelectItem>
                            <SelectItem value="long">طويل</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold h-11" disabled={articleLoading || !aiTopic.trim()}>
                      {articleLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin ml-2" />
                          جاري التوليد... قد يستغرق بضع ثوان
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 ml-2" />
                          توليد المقال
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              )}

              {/* WRITE / EDIT VIEW */}
              {(articleView === 'write' || articleView === 'edit') && (
                <div className="max-w-2xl mx-auto">
                  <Button variant="ghost" size="sm" onClick={() => { resetArticleForm(); setArticleView('list'); }} className="mb-4">
                    <ChevronLeft className="h-4 w-4 ml-1" />
                    العودة للمقالات
                  </Button>
                  <div className="bg-slate-50 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-2">
                      {articleView === 'edit' ? (
                        <FileEdit className="h-5 w-5 text-blue-600" />
                      ) : articleView === 'write' && editingArticle === null && aiTopic ? (
                        <Sparkles className="h-5 w-5 text-violet-600" />
                      ) : (
                        <Pencil className="h-5 w-5 text-emerald-600" />
                      )}
                      <h3 className="font-semibold text-slate-800">
                        {articleView === 'edit' ? 'تعديل المقال' : editingArticle === null && aiTopic ? 'مراجعة المقال المُولّد' : 'كتابة مقال جديد'}
                      </h3>
                    </div>
                  </div>
                  <form onSubmit={handleSaveArticle} className="space-y-4">
                    <div className="space-y-2">
                      <Label>عنوان المقال</Label>
                      <Input
                        placeholder="أدخل عنوان المقال"
                        value={articleTitle}
                        onChange={(e) => setArticleTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>ملخص قصير</Label>
                      <Input
                        placeholder="ملخص قصير عن المقال (اختياري)"
                        value={articleExcerpt}
                        onChange={(e) => setArticleExcerpt(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>محتوى المقال</Label>
                      <Textarea
                        placeholder="اكتب محتوى المقال هنا..."
                        value={articleContent}
                        onChange={(e) => setArticleContent(e.target.value)}
                        rows={15}
                        className="min-h-[300px]"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-11" disabled={articleLoading}>
                        {articleLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Send className="h-5 w-5 ml-2" />حفظ المقال</>}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => { resetArticleForm(); setArticleView('list'); }} className="h-11">
                        إلغاء
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-xs text-slate-400">
            لوحة التحكم &copy; {new Date().getFullYear()} شركة كيان القمة - جميع الحقوق محفوظة
          </p>
        </div>
      </footer>
    </div>
  );
}
