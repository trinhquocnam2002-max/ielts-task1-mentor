
import { db } from "@/lib/db";
import Link from "next/link";

// Force dynamic rendering to ensure we always get the latest history
export const dynamic = "force-dynamic";

export default async function HistoryPage() {
    // Fetch history from the database, ordered by newest first
    const history = await db.essayHistory.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-600">My Essay History</h1>
                    <Link
                        href="/"
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Back to Practice
                    </Link>
                </div>

                {history.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-lg">You haven't submitted any essays yet.</p>
                        <Link
                            href="/"
                            className="mt-4 inline-block text-blue-500 hover:underline"
                        >
                            Start Writing
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map((item) => {
                            // Try to parse feedback if it's JSON, otherwise use as is
                            let feedbackObj: any = {};
                            try {
                                feedbackObj = JSON.parse(item.feedback);
                            } catch (e) { }

                            // Extract a short feedback snippet
                            const summary = feedbackObj.feedback || "No feedback summary available.";

                            return (
                                <div
                                    key={item.id}
                                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-2">
                                                Band {item.bandScore}
                                            </span>
                                            <p className="text-sm text-gray-400">
                                                {new Date(item.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="font-semibold text-gray-700 mb-1">Essay Content:</h3>
                                        <p className="text-gray-600 line-clamp-2 text-sm italic">
                                            "{item.essayText}"
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-700 mb-1">Feedback:</h3>
                                        <p className="text-gray-800">{summary}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
