/**
 * 이용약관 / 개인정보처리방침 페이지
 */
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import {
  POLICY_EFFECTIVE_DATE,
  PRIVACY_SECTIONS,
  TERMS_SECTIONS,
  type PolicySection,
} from '@/constants/policyContent';

const renderPolicySections = (sections: PolicySection[]) => {
  return sections.map((section) => (
    <section key={section.title}>
      <h3 className="mb-2 text-base font-bold text-neutral-900">{section.title}</h3>

      {(section.paragraphs || []).map((paragraph) => (
        <p key={paragraph} className="mb-2 last:mb-0">
          {paragraph}
        </p>
      ))}

      {section.bullets && section.bullets.length > 0 && (
        <ul className="list-disc pl-5 space-y-1">
          {section.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      )}
    </section>
  ));
};

const PolicyPage = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'privacy' ? 'privacy' : 'terms';
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>(initialTab);

  const sections = activeTab === 'terms' ? TERMS_SECTIONS : PRIVACY_SECTIONS;

  return (
    <div className="min-h-screen bg-white py-5 pb-20 min-[360px]:py-6">
      <div className="mx-auto max-w-3xl px-3 min-[360px]:px-4">
        <div className="mb-5 flex items-center gap-2 min-[360px]:mb-6 min-[360px]:gap-3">
          <Link
            to="/"
            className="p-2 -ml-2 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-neutral-900" />
          </Link>
          <h1 className="text-xl font-bold text-neutral-900 min-[360px]:text-2xl">약관 및 정책</h1>
        </div>

        <div className="mb-6 flex border-b border-neutral-200">
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 pb-4 text-center text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'terms'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-400 hover:text-neutral-600'
            }`}
          >
            서비스 이용약관
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 pb-4 text-center text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'privacy'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-400 hover:text-neutral-600'
            }`}
          >
            개인정보처리방침
          </button>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-neutral-700">
          {renderPolicySections(sections)}

          <div className="rounded-lg bg-neutral-50 p-4 text-xs text-neutral-500">
            시행일자: {POLICY_EFFECTIVE_DATE}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;
