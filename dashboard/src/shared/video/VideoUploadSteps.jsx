import { useState } from "react";

const VideoUploadSteps = () => {
  const [step, setStep] = useState(1);
  const [videoList, setVideoList] = useState([
    { id: Date.now(), quality: "1080p", file: null },
  ]);

  const qualities = ["4K", "1080p", "720p", "480p", "360p"];
  const categories = ["Action", "Drama", "Comedy", "Thriller", "Sci-Fi"];

  // নতুন ভিডিও আপলোড বক্স অ্যাড করা
  const addVideoBox = () => {
    setVideoList([
      ...videoList,
      { id: Date.now(), quality: "720p", file: null },
    ]);
  };

  // নির্দিষ্ট বক্স রিমুভ করা
  const removeVideoBox = (id) => {
    if (videoList.length > 1) {
      setVideoList(videoList.filter((v) => v.id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500 pb-10">
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden">
        {/* Header with Stepper */}
        <div className="bg-slate-50 px-10 py-8 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">
              XCinema Content Manager
            </h3>
            <p className="text-sm text-slate-500 font-medium">
              Step {step} of 2 • {step === 1 ? "Details" : "Media"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold transition-all ${
                    step >= s
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {step > s ? "✓" : s}
                </div>
                {s < 2 && (
                  <div
                    className={`w-12 h-1 mx-2 rounded-full ${step > s ? "bg-indigo-600" : "bg-slate-200"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-10">
          {/* STEP 1: TEXT DATA */}
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Movie/Video Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 outline-none bg-slate-50 focus:bg-white transition-all"
                    placeholder="Enter full title..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Category
                  </label>
                  <select className="w-full px-6 py-4 rounded-2xl border border-slate-200 outline-none bg-slate-50 focus:bg-white transition-all">
                    {categories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Network / Channel
                  </label>
                  <input
                    type="text"
                    className="w-full px-6 py-4 rounded-2xl border border-slate-200 outline-none bg-slate-50 focus:bg-white transition-all"
                    placeholder="e.g. Netflix, HBO"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Synopsis
                  </label>
                  <textarea
                    rows="4"
                    className="w-full px-6 py-4 rounded-2xl border border-slate-200 outline-none bg-slate-50 focus:bg-white transition-all"
                    placeholder="Write detailed description..."
                  ></textarea>
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl text-lg"
              >
                Continue to Media Upload
              </button>
            </div>
          )}

          {/* STEP 2: DYNAMIC MULTI-VIDEO UPLOAD */}
          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-slate-800 text-lg">
                  Manage Video Sources
                </h4>
                <button
                  onClick={addVideoBox}
                  className="px-5 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-all flex items-center gap-2"
                >
                  <span>+</span> Add Another Quality
                </button>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {videoList.map((video) => (
                  <div
                    key={video.id}
                    className="p-6 bg-slate-50 rounded-[2rem] border border-slate-200 flex flex-col md:flex-row gap-6 items-center relative group transition-all hover:border-indigo-200"
                  >
                    <div className="w-full md:w-40 shrink-0">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                        Quality
                      </label>
                      <select className="w-full p-3 rounded-xl border border-slate-200 font-bold text-slate-700 outline-none bg-white">
                        {qualities.map((q) => (
                          <option
                            key={q}
                            value={q}
                            selected={q === video.quality}
                          >
                            {q}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex-1 w-full">
                      <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 rounded-2xl hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer group">
                        <div className="text-center">
                          <span className="text-xs font-bold text-slate-500 group-hover:text-indigo-600">
                            Click to upload {video.quality} source
                          </span>
                        </div>
                        <input type="file" className="hidden" />
                      </label>
                    </div>

                    {videoList.length > 1 && (
                      <button
                        onClick={() => removeVideoBox(video.id)}
                        className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-all"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200"
                >
                  Back
                </button>
                <button className="flex-[2] py-5 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 shadow-xl transition-all">
                  Complete & Publish Cinema
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoUploadSteps;
