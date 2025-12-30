"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [essay, setEssay] = useState("");
  const [loading, setLoading] = useState(false);
  /* Updated to match new API response structure */
  const [result, setResult] = useState<any | null>(null);
  const [chartImage, setChartImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGrade = async () => {
    if (!essay.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: essay }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        alert("Error: " + (data.error || "Failed to grade"));
      }
    } catch (error) {
      // ...
      // Update the UI rendering part:
      // ... 
      /* THIS TOOL CALL ONLY REPLACES THE TOP PART. UI REPLACEMENT BELOW IN SEPARATE CALL IF NEEDED or I can do it here if I include enough context? */
      /* I'll start with the logic replacement. */
      console.error(error);
      alert("Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setChartImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header / Nav */}
      <header className="w-full bg-white border-b border-gray-200 py-4 px-6 md:px-12 shadow-sm flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">IELTS Task 1 Master</h1>
        <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
          History
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row p-4 md:p-8 gap-6 max-w-7xl mx-auto w-full">

        {/* Left Column: Chart Area */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1 flex items-center justify-center min-h-[300px] md:min-h-[500px] relative overflow-hidden">

            {chartImage ? (
              <div className="relative w-full h-full flex flex-col items-center">
                <div className="relative w-full flex-1 min-h-[300px]">
                  <Image
                    src={chartImage}
                    alt="Task 1 Chart"
                    fill
                    className="object-contain"
                  />
                </div>
                <button
                  onClick={() => setChartImage(null)}
                  className="mt-4 text-sm text-red-500 hover:text-red-700 font-medium underline z-10"
                >
                  Xóa ảnh / Chọn ảnh khác
                </button>
              </div>
            ) : (
              <div
                className="text-center cursor-pointer hover:bg-gray-50 p-8 rounded-xl transition-colors w-full h-full flex flex-col items-center justify-center"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="bg-blue-50 text-blue-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium text-lg">Nhấn để tải ảnh biểu đồ lên</p>
                <p className="text-gray-400 text-sm mt-2">Hỗ trợ JPG, PNG</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            )}
          </div>

          {/* Result Display Area */}
          {result && (
            <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Kết quả đánh giá</h2>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-lg">
                  Band: {result.overall_score || result.band_score}
                </span>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700">Nhận xét chi tiết:</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {result.feedback}
                </p>

                {result.task_response && (
                  <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-medium text-gray-500">
                    <div className="bg-gray-50 p-2 rounded border">TR: {result.task_response}</div>
                    <div className="bg-gray-50 p-2 rounded border">CC: {result.coherence}</div>
                    <div className="bg-gray-50 p-2 rounded border">LR: {result.lexical}</div>
                    <div className="bg-gray-50 p-2 rounded border">GRA: {result.grammar}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Input & Action */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1 flex flex-col">
            <label htmlFor="essay-input" className="text-lg font-semibold text-gray-800 mb-3">
              Bài làm của bạn
            </label>
            <textarea
              id="essay-input"
              className="w-full flex-1 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-gray-700 leading-relaxed min-h-[300px]"
              placeholder="Nhập bài viết IELTS Task 1 của bạn vào đây..."
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              disabled={loading}
            ></textarea>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleGrade}
                disabled={loading || !essay.trim()}
                className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all duration-200 flex items-center gap-2 
                  ${loading ? "opacity-70 cursor-not-allowed" : "transform active:scale-95"}`}
              >
                {loading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <span>✨</span>
                    Chấm điểm ngay với AI
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
