import { db } from "@/lib/db";
import Link from "next/link";

// Ensure the page is dynamic so it fetches the latest data on every request
export const dynamic = 'force-dynamic';

interface Score {
    id: number;
    date: Date;
    essay_content: string;
    band_score: string;
    feedback_json: string;
}

export default async function DashboardPage() {
    // Fetch scores from the database
    const scores = await db.iELTS_Scores.findMany({
        orderBy: {
            date: 'desc',
        },
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <header className="w-full bg-white border-b border-gray-200 py-4 px-6 md:px-12 shadow-sm flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">IELTS Task 1 Dashboard</h1>
                <Link
                    href="/"
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Back to Practice
                </Link>
            </header>

            <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800">Lịch sử Chấm điểm</h2>
                        <p className="text-gray-500">Xem lại các bài làm và kết quả đánh giá của bạn.</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-gray-600">
                            <thead className="bg-gray-50 text-gray-700 uppercase leading-normal text-sm font-semibold">
                                <tr>
                                    <th className="py-3 px-6 text-left">Ngày</th>
                                    <th className="py-3 px-6 text-left">Band Score</th>
                                    <th className="py-3 px-6 text-left w-1/3">Bài làm (Trích dẫn)</th>
                                    <th className="py-3 px-6 text-left w-1/3">Nhận xét chính</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {scores.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-gray-500 text-base">
                                            Chưa có bài làm nào được lưu.
                                        </td>
                                    </tr>
                                ) : (
                                    scores.map((score: Score) => {
                                        let feedback: string[] = [];
                                        try {
                                            feedback = JSON.parse(score.feedback_json as string);
                                        } catch (e) {
                                            feedback = ["Lỗi đọc dữ liệu"];
                                        }

                                        return (
                                            <tr key={score.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-6 whitespace-nowrap">
                                                    <span className="font-medium">
                                                        {new Date(score.date).toLocaleDateString('vi-VN', {
                                                            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`${parseFloat(score.band_score) >= 7.0 ? 'bg-green-100 text-green-700' :
                                                        parseFloat(score.band_score) >= 6.0 ? 'bg-blue-100 text-blue-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                        } py-1 px-3 rounded-full text-xs font-bold`}>
                                                        {score.band_score}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="truncate max-w-xs" title={score.essay_content}>
                                                        {score.essay_content}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <ul className="list-disc list-inside space-y-1">
                                                        {feedback.slice(0, 2).map((item, idx) => (
                                                            <li key={idx} className="truncate max-w-xs" title={item}>{item}</li>
                                                        ))}
                                                        {feedback.length > 2 && (
                                                            <li className="text-gray-400 italic text-xs">+{feedback.length - 2} ý khác...</li>
                                                        )}
                                                    </ul>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
