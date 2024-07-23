'use client';

import { useSignUp } from '@/hooks/auth/useUsers';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface SignUpFormData {
  email: string;
  password: string;
  nickname: string;
}

const SignUpForm = () => {
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    password: '',
    nickname: '',
  });

  const router = useRouter();
  const { mutate: signUp, isPending, error } = useSignUp();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    signUp(formData, {
      onSuccess: () => {
        alert('회원가입이 완료되었습니다!');
        router.push('/log-in');
      },
      onError: (error) => {
        console.error('Sign-up error:', error);
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4  items-center justify-center">
        <div className="flex flex-col">
          <label htmlFor="email">이메일:</label>
          <input
            type="email"
            id="email"
            name="email"
            className="border border-black"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">비밀번호:</label>
          <input
            type="password"
            id="password"
            name="password"
            className="border border-black"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="nickname">닉네임:</label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            className="border border-black"
            value={formData.nickname}
            onChange={handleChange}
            required
          />
        </div>
        {error && <div className="text-red-500">{(error as Error).message}</div>}
        <button type="submit" className="border border-black px-2 py-1.5" disabled={isPending}>
          {isPending ? '처리 중...' : '회원가입'}
        </button>
        <div>
          {' '}
          <Link href="/log-in" className="border border-black px-2 py-1.5">
            로그인
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;