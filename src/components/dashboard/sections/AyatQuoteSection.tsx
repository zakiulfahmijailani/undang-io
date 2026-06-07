"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import type { SectionFormProps } from "./types";
import { PREDEFINED_QUOTES } from "@/data/quotes";

export function AyatQuoteSection({ data, onChange }: SectionFormProps) {
  // Try to find if the current data matches a predefined quote
  const matchedQuoteId = PREDEFINED_QUOTES.find(
    (q) => q.text === data.quote_text && q.source === data.quote_source
  )?.id || "custom";

  const [selectedValue, setSelectedValue] = useState<string>(matchedQuoteId);

  // Group quotes by religion
  const quotesByReligion = PREDEFINED_QUOTES.reduce((acc, quote) => {
    if (!acc[quote.religion]) acc[quote.religion] = [];
    acc[quote.religion].push(quote);
    return acc;
  }, {} as Record<string, typeof PREDEFINED_QUOTES>);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedValue(val);
    
    if (val === "custom") {
      // Just let them edit what they have, don't clear it immediately
      return;
    }

    const selectedQuote = PREDEFINED_QUOTES.find((q) => q.id === val);
    if (selectedQuote) {
      onChange({
        quote_text: selectedQuote.text,
        quote_source: selectedQuote.source,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Select 
          label="Pilih Template Ayat / Quote" 
          value={selectedValue} 
          onChange={handleSelectChange}
        >
          <option value="custom">-- Tulis Sendiri / Kustom --</option>
          {Object.entries(quotesByReligion).map(([religion, quotes]) => (
            <optgroup key={religion} label={religion}>
              {quotes.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.source} - {q.text.substring(0, 40)}...
                </option>
              ))}
            </optgroup>
          ))}
        </Select>
      </div>

      <div className="space-y-4 border-t pt-4">
        <div className="space-y-2">
          <Label>Teks Ayat / Quote</Label>
          <Textarea 
            rows={5} 
            value={data.quote_text || ""} 
            onChange={(e) => {
              setSelectedValue("custom");
              onChange({ quote_text: e.target.value });
            }} 
            placeholder="Tulis ayat atau kutipan romantis di sini..."
          />
        </div>
        <div className="space-y-2">
          <Label>Sumber Referensi</Label>
          <Input 
            placeholder="Cth: QS. Ar-Rum: 21" 
            value={data.quote_source || ""} 
            onChange={(e) => {
              setSelectedValue("custom");
              onChange({ quote_source: e.target.value });
            }} 
          />
        </div>
      </div>
    </div>
  );
}
