'use client';

import React from 'react';
import { Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import type { PageSection, PageConfig } from '@/agents/state';

type Props = {
  page: PageConfig;
  selectedId: string | null;
  onChange: (page: PageConfig) => void;
  onDelete: (id: string) => void;
};

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="builder-prop-group">
      <label className="builder-prop-label">{label}</label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      className="builder-prop-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

function TextArea({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <textarea
      className="builder-prop-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      style={{ resize: 'vertical' }}
    />
  );
}

function SelectInput({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select className="builder-prop-input" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function updateSection(page: PageConfig, sectionId: string, updates: Record<string, unknown>): PageConfig {
  return {
    ...page,
    sections: page.sections.map((s) =>
      s.id === sectionId ? { ...s, ...updates } as PageSection : s
    ),
  };
}

function updateNestedArrayItem(page: PageConfig, sectionId: string, arrayKey: string, itemId: string, updates: Record<string, unknown>): PageConfig {
  return {
    ...page,
    sections: page.sections.map((s) => {
      if (s.id !== sectionId) return s;
      const arr = (s as Record<string, unknown>)[arrayKey] as Array<Record<string, unknown>>;
      return {
        ...s,
        [arrayKey]: arr.map((item) => item.id === itemId ? { ...item, ...updates } : item),
      } as PageSection;
    }),
  };
}

export function PropertyPanel({ page, selectedId, onChange, onDelete }: Props) {
  const section = page.sections.find((s) => s.id === selectedId);
  if (!section) {
    return (
      <div className="builder-props">
        <div className="builder-props-empty">
          <p>Select a section to edit</p>
        </div>
      </div>
    );
  }

  const idx = page.sections.findIndex((s) => s.id === section.id);
  const canMoveUp = idx > 0;
  const canMoveDown = idx < page.sections.length - 1;

  const moveSection = (direction: 'up' | 'down') => {
    const newSections = [...page.sections];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    [newSections[idx], newSections[targetIdx]] = [newSections[targetIdx], newSections[idx]];
    onChange({ ...page, sections: newSections });
  };

  return (
    <div className="builder-props">
      <div className="builder-props-header">
        <span className="builder-props-title">{section.type.toUpperCase()}</span>
        <div className="builder-props-actions">
          <button className="builder-props-action" onClick={() => moveSection('up')} disabled={!canMoveUp}><ArrowUp size={13} /></button>
          <button className="builder-props-action" onClick={() => moveSection('down')} disabled={!canMoveDown}><ArrowDown size={13} /></button>
          <button className="builder-props-action danger" onClick={() => onDelete(section.id)}><Trash2 size={13} /></button>
        </div>
      </div>

      <div className="builder-props-body">
        {section.type === 'hero' && (
          <>
            <FieldGroup label="Headline"><TextInput value={section.headline} onChange={(v) => onChange(updateSection(page, section.id, { headline: v }))} placeholder="Your headline" /></FieldGroup>
            <FieldGroup label="Subtext"><TextArea value={section.subtext} onChange={(v) => onChange(updateSection(page, section.id, { subtext: v }))} placeholder="Description text" /></FieldGroup>
            <FieldGroup label="CTA Label"><TextInput value={section.cta_label} onChange={(v) => onChange(updateSection(page, section.id, { cta_label: v }))} placeholder="Get Started" /></FieldGroup>
            <FieldGroup label="CTA URL"><TextInput value={section.cta_url} onChange={(v) => onChange(updateSection(page, section.id, { cta_url: v }))} placeholder="https://" /></FieldGroup>
            <FieldGroup label="Alignment"><SelectInput value={section.alignment} onChange={(v) => onChange(updateSection(page, section.id, { alignment: v }))} options={['left', 'center', 'right']} /></FieldGroup>
          </>
        )}

        {section.type === 'features' && (
          <>
            <FieldGroup label="Title"><TextInput value={section.title} onChange={(v) => onChange(updateSection(page, section.id, { title: v }))} placeholder="Features" /></FieldGroup>
            <FieldGroup label="Columns"><SelectInput value={String(section.columns)} onChange={(v) => onChange(updateSection(page, section.id, { columns: Number(v) }))} options={['2', '3', '4']} /></FieldGroup>
            {section.items.map((item, i) => (
              <div key={item.id} className="builder-prop-nested">
                <div className="builder-prop-nested-header">Feature {i + 1}</div>
                <FieldGroup label="Title"><TextInput value={item.title} onChange={(v) => onChange(updateNestedArrayItem(page, section.id, 'items', item.id, { title: v }))} /></FieldGroup>
                <FieldGroup label="Description"><TextInput value={item.description} onChange={(v) => onChange(updateNestedArrayItem(page, section.id, 'items', item.id, { description: v }))} /></FieldGroup>
              </div>
            ))}
          </>
        )}

        {section.type === 'pricing' && (
          <>
            <FieldGroup label="Title"><TextInput value={section.title} onChange={(v) => onChange(updateSection(page, section.id, { title: v }))} placeholder="Pricing" /></FieldGroup>
            {section.plans.map((plan, i) => (
              <div key={plan.id} className="builder-prop-nested">
                <div className="builder-prop-nested-header">Plan {i + 1} {plan.highlighted ? '(highlighted)' : ''}</div>
                <FieldGroup label="Name"><TextInput value={plan.name} onChange={(v) => onChange(updateNestedArrayItem(page, section.id, 'plans', plan.id, { name: v }))} /></FieldGroup>
                <FieldGroup label="Price"><TextInput value={plan.price} onChange={(v) => onChange(updateNestedArrayItem(page, section.id, 'plans', plan.id, { price: v }))} /></FieldGroup>
                <FieldGroup label="Period"><TextInput value={plan.period} onChange={(v) => onChange(updateNestedArrayItem(page, section.id, 'plans', plan.id, { period: v }))} /></FieldGroup>
                <FieldGroup label="CTA Label"><TextInput value={plan.cta_label} onChange={(v) => onChange(updateNestedArrayItem(page, section.id, 'plans', plan.id, { cta_label: v }))} /></FieldGroup>
                <FieldGroup label="Features (one per line)">
                  <TextArea
                    value={plan.features.join('\n')}
                    onChange={(v) => onChange(updateNestedArrayItem(page, section.id, 'plans', plan.id, { features: v.split('\n').filter(Boolean) }))}
                    placeholder="Feature 1&#10;Feature 2"
                  />
                </FieldGroup>
              </div>
            ))}
          </>
        )}

        {section.type === 'checkout' && (
          <>
            <FieldGroup label="Title"><TextInput value={section.title} onChange={(v) => onChange(updateSection(page, section.id, { title: v }))} /></FieldGroup>
            <FieldGroup label="Description"><TextArea value={section.description} onChange={(v) => onChange(updateSection(page, section.id, { description: v }))} /></FieldGroup>
            <FieldGroup label="Amount"><TextInput value={String(section.amount)} onChange={(v) => onChange(updateSection(page, section.id, { amount: Number(v) || 0 }))} /></FieldGroup>
            <FieldGroup label="Currency"><SelectInput value={section.currency} onChange={(v) => onChange(updateSection(page, section.id, { currency: v }))} options={['IDR', 'USD', 'SGD', 'MYR']} /></FieldGroup>
            <FieldGroup label="CTA Label"><TextInput value={section.cta_label} onChange={(v) => onChange(updateSection(page, section.id, { cta_label: v }))} /></FieldGroup>
          </>
        )}

        {section.type === 'testimonials' && (
          <>
            <FieldGroup label="Title"><TextInput value={section.title} onChange={(v) => onChange(updateSection(page, section.id, { title: v }))} /></FieldGroup>
            {section.items.map((item, i) => (
              <div key={item.id} className="builder-prop-nested">
                <div className="builder-prop-nested-header">Review {i + 1}</div>
                <FieldGroup label="Name"><TextInput value={item.name} onChange={(v) => onChange(updateNestedArrayItem(page, section.id, 'items', item.id, { name: v }))} /></FieldGroup>
                <FieldGroup label="Role"><TextInput value={item.role} onChange={(v) => onChange(updateNestedArrayItem(page, section.id, 'items', item.id, { role: v }))} /></FieldGroup>
                <FieldGroup label="Content"><TextArea value={item.content} onChange={(v) => onChange(updateNestedArrayItem(page, section.id, 'items', item.id, { content: v }))} /></FieldGroup>
              </div>
            ))}
          </>
        )}

        {section.type === 'faq' && (
          <>
            <FieldGroup label="Title"><TextInput value={section.title} onChange={(v) => onChange(updateSection(page, section.id, { title: v }))} /></FieldGroup>
            {section.items.map((item, i) => (
              <div key={item.id} className="builder-prop-nested">
                <div className="builder-prop-nested-header">Q{i + 1}</div>
                <FieldGroup label="Question"><TextInput value={item.question} onChange={(v) => onChange(updateNestedArrayItem(page, section.id, 'items', item.id, { question: v }))} /></FieldGroup>
                <FieldGroup label="Answer"><TextArea value={item.answer} onChange={(v) => onChange(updateNestedArrayItem(page, section.id, 'items', item.id, { answer: v }))} /></FieldGroup>
              </div>
            ))}
          </>
        )}

        {section.type === 'footer' && (
          <>
            <FieldGroup label="Brand Name"><TextInput value={section.brand_name} onChange={(v) => onChange(updateSection(page, section.id, { brand_name: v }))} /></FieldGroup>
            <FieldGroup label="Tagline"><TextInput value={section.tagline} onChange={(v) => onChange(updateSection(page, section.id, { tagline: v }))} /></FieldGroup>
            {section.links.map((link, i) => (
              <div key={link.id} className="builder-prop-nested">
                <div className="builder-prop-nested-header">Link {i + 1}</div>
                <FieldGroup label="Label"><TextInput value={link.label} onChange={(v) => onChange(updateNestedArrayItem(page, section.id, 'links', link.id, { label: v }))} /></FieldGroup>
                <FieldGroup label="URL"><TextInput value={link.url} onChange={(v) => onChange(updateNestedArrayItem(page, section.id, 'links', link.id, { url: v }))} /></FieldGroup>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
