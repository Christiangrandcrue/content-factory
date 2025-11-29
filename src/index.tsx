import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { renderer } from './renderer'

type Bindings = {
  REPLICATE_API_TOKEN: string
  FACTORY_ACCESS_TOKEN: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/*', cors({
  origin: ['https://ads.synthnova.me', 'http://localhost:3000'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Factory-Secret'],
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
}))

app.use(renderer)

app.get('/', (c) => {
  return c.render(
    <div class="min-h-screen bg-[#0a0a0a] text-gray-300 font-mono selection:bg-purple-900 selection:text-white">
      <div class="fixed inset-0 opacity-[0.03] pointer-events-none" 
           style={{backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)', backgroundSize: '50px 50px'}}>
      </div>

      <main class="relative z-10 w-full max-w-7xl mx-auto p-4 md:p-8">
        
        {/* HEADER V4.1 ASYNC */}
        <header class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-white/10 pb-6 gap-4">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold tracking-tighter text-white">
              CONTENT_FACTORY<span class="text-purple-500">.AI</span>
            </h1>
            <div class="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">Intelligent Creative Suite v4.1 (Async)</div>
          </div>
          
          {/* TAB SWITCHER */}
          <div class="flex bg-white/5 p-1 rounded border border-white/10 backdrop-blur-sm">
            <button id="tab-director" class="px-4 py-2 text-xs font-bold text-white bg-purple-600 rounded shadow-lg transition-all hover:bg-purple-500 flex items-center gap-2">
               <span>✨ CREATIVE DIRECTOR</span>
            </button>
            <div class="w-px bg-white/10 mx-1"></div>
            <button id="tab-lab" class="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white transition-all flex items-center gap-2">
               <span>🛠 MANUAL LAB</span>
            </button>
          </div>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN */}
          <div class="lg:col-span-7 space-y-6">
            
            {/* --- VIEW 1: CREATIVE DIRECTOR (AI) --- */}
            <div id="director-view" class="bg-[#111] border border-purple-500/30 rounded-sm overflow-hidden shadow-2xl animate-in fade-in">
               <div class="bg-gradient-to-r from-purple-900/20 to-transparent px-4 py-3 border-b border-purple-500/20 flex justify-between items-center">
                  <h3 class="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                    <span>🧠 AI Concept Brain</span>
                  </h3>
                  <span class="text-[9px] text-purple-300/50 bg-purple-500/10 px-2 py-1 rounded">POWERED BY LLAMA 3</span>
               </div>
               
               <div class="p-6 space-y-6">
                  <div>
                    <label class="text-[10px] uppercase text-gray-500 font-bold mb-2 block">Your Idea (Natural Language)</label>
                    <textarea id="idea-input" rows="3" placeholder="e.g. Lady Gaga paragliding around Eiffel Tower, cinematic helicopter shot..." 
                              class="w-full bg-black border border-white/20 text-white p-3 text-sm focus:border-purple-500 focus:outline-none transition-colors rounded-sm font-sans resize-none"></textarea>
                  </div>
                  
                  <div class="flex justify-between items-center">
                     <div class="text-[10px] text-gray-600 max-w-[200px]">AI will generate a professional prompt and suggest technical settings.</div>
                     <button id="consult-btn" type="button" class="px-6 py-3 bg-white text-black text-xs font-bold uppercase hover:bg-purple-400 hover:text-white transition-all flex items-center gap-2 shadow-lg active:scale-95">
                        <span>Analyze & Suggest</span>
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                     </button>
                  </div>

                  {/* AI OUTPUT CONTAINER */}
                  <div id="ai-suggestions" class="hidden border-t border-white/10 pt-6 mt-2 space-y-4">
                      <div class="grid grid-cols-2 gap-4">
                          <div class="bg-purple-500/5 border border-purple-500/20 p-3 rounded relative overflow-hidden">
                             <div class="text-[9px] uppercase text-purple-400 font-bold mb-1">Recommended Model</div>
                             <div id="sugg-model" class="text-white font-bold text-sm">---</div>
                             <div id="sugg-reason" class="text-[10px] text-gray-400 mt-1 leading-tight opacity-70">---</div>
                          </div>
                          <div class="bg-white/5 border border-white/10 p-3 rounded">
                             <div class="text-[9px] uppercase text-gray-400 font-bold mb-1">Technical Specs</div>
                             <div id="sugg-tech" class="text-[10px] text-gray-300 font-mono">---</div>
                          </div>
                      </div>
                      <div>
                          <label class="text-[10px] uppercase text-gray-500 font-bold mb-1 block">Optimized Prompt</label>
                          <div class="relative">
                             <textarea id="final-prompt" rows="2" class="w-full bg-[#050505] border border-purple-500/30 text-purple-100 p-3 text-xs font-mono rounded-sm focus:outline-none"></textarea>
                             <button id="apply-prompt-btn" class="absolute bottom-2 right-2 text-[9px] bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-500 font-bold shadow-lg transition-transform hover:scale-105">
                                USE IN LAB ➔
                             </button>
                          </div>
                      </div>
                  </div>
               </div>
            </div>

            {/* --- VIEW 2: MANUAL LAB (Tabs) --- */}
            <div id="manual-view" class="hidden bg-[#111] border border-white/10 rounded-sm overflow-hidden shadow-2xl">
               <div class="flex border-b border-white/10">
                  <button id="mode-image" class="flex-1 py-3 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 border-r border-white/10 transition-all">1. IMAGE PREP</button>
                  <button id="mode-video" class="flex-1 py-3 text-xs font-bold bg-white/10 text-white shadow-inner">2. VIDEO GENERATION</button>
               </div>
               
               <div class="p-6">
                  {/* IMAGE FORM */}
                  <form id="image-form" class="space-y-6 hidden">
                     <div class="space-y-2">
                        <label class="text-[10px] uppercase text-gray-500 font-bold">Source Image</label>
                        <div class="flex gap-2">
                           <input type="url" name="sourceUrl" required placeholder="Upload or Paste URL" class="flex-1 bg-black border border-white/20 text-white p-3 text-sm rounded-sm font-mono truncate" />
                           <input type="file" id="img-upload" accept="image/*" class="hidden" />
                           <button type="button" onclick="document.getElementById('img-upload').click()" class="px-4 bg-white/10 hover:bg-white/20 text-[10px] font-bold rounded-sm">UPLOAD</button>
                        </div>
                     </div>
                     <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                           <label class="text-[10px] uppercase text-gray-500 font-bold">Action</label>
                           <select name="action" class="w-full bg-black border border-white/20 text-white p-3 text-xs rounded-sm">
                              <option value="upscale">Upscale (4x Quality)</option>
                              <option value="face_fix">Fix Faces (Avatar)</option>
                           </select>
                        </div>
                        <div class="space-y-2">
                           <label class="text-[10px] uppercase text-gray-500 font-bold">Scale</label>
                           <select name="scale" class="w-full bg-black border border-white/20 text-white p-3 text-xs rounded-sm">
                              <option value="2">2x</option>
                              <option value="4" selected>4x</option>
                           </select>
                        </div>
                     </div>
                     <button type="submit" class="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-sm">Process Image</button>
                  </form>

                  {/* VIDEO FORM */}
                  <form id="video-form" class="space-y-6">
                     <div class="space-y-2">
                        <label class="text-[10px] uppercase text-gray-500 font-bold">Reference Image</label>
                        <div class="flex gap-2">
                           <input type="url" id="video-source-url" name="sourceUrl" required placeholder="Image URL required for SVD" class="flex-1 bg-black border border-white/20 text-white p-3 text-sm rounded-sm font-mono truncate" />
                           <input type="file" id="vid-upload" accept="image/*" class="hidden" />
                           <button type="button" onclick="document.getElementById('vid-upload').click()" class="px-4 bg-white/10 hover:bg-white/20 text-[10px] font-bold rounded-sm">UPLOAD</button>
                        </div>
                     </div>

                     <div class="space-y-2">
                        <label class="text-[10px] uppercase text-gray-500 font-bold">Prompt / Context</label>
                        <textarea id="video-prompt" name="prompt" rows="2" placeholder="Describe motion..." class="w-full bg-black border border-white/20 text-white p-2 text-xs rounded-sm font-mono"></textarea>
                     </div>

                     <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                           <label class="text-[10px] uppercase text-gray-500 font-bold">Motion (1-255)</label>
                           <input type="number" id="motion-bucket" name="motionBucket" value="127" class="w-full bg-black border border-white/20 text-white p-3 text-sm rounded-sm font-mono" />
                        </div>
                        <div class="space-y-2">
                           <label class="text-[10px] uppercase text-gray-500 font-bold">FPS</label>
                           <select name="fps" class="w-full bg-black border border-white/20 text-white p-3 text-sm rounded-sm">
                              <option value="6">6 FPS</option>
                              <option value="24">24 FPS</option>
                           </select>
                        </div>
                     </div>
                     <button type="submit" class="w-full py-3 bg-white text-black hover:bg-gray-200 text-xs font-bold uppercase tracking-wider rounded-sm">Generate Video</button>
                  </form>
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN: OUTPUT FEED */}
          <div class="lg:col-span-5 space-y-4">
             <div class="bg-[#111] border border-white/10 rounded-sm min-h-[400px] flex flex-col relative">
                <div class="bg-white/5 px-4 py-2 border-b border-white/10 flex justify-between items-center">
                   <h3 class="text-xs font-bold text-white uppercase tracking-wider">Output Feed</h3>
                   <div id="status-badge" class="text-[9px] font-mono bg-black px-2 py-1 rounded text-gray-500">IDLE</div>
                </div>
                
                <div class="flex-1 bg-black/50 flex items-center justify-center p-4 relative overflow-hidden group">
                    <div id="placeholder" class="text-center opacity-30">
                      <div class="text-4xl mb-2">⦿</div>
                      <div class="text-[10px] font-mono">WAITING FOR SIGNAL</div>
                    </div>
                    
                    <img id="result-image" class="max-w-full max-h-full hidden object-contain shadow-2xl" />
                    <video id="result-video" class="max-w-full max-h-full hidden shadow-2xl" controls loop autoplay muted></video>
                    
                    <div id="loader" class="hidden absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                       <div class="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full mb-4"></div>
                       <div id="loader-text" class="text-xs font-mono text-white animate-pulse">PROCESSING...</div>
                    </div>

                    <div id="transfer-overlay" class="hidden absolute bottom-4 left-0 w-full flex justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button id="transfer-btn" class="px-4 py-2 bg-purple-600 text-white text-xs font-bold uppercase shadow-lg hover:bg-purple-500 rounded-full flex items-center gap-2">
                          <span>🎬 Use as Reference</span>
                       </button>
                    </div>
                </div>

                <div class="h-[150px] bg-[#050505] border-t border-white/10 p-3 font-mono text-[9px] text-gray-400 overflow-y-auto" id="api-logs">
                   <div>[SYSTEM] Factory v4.1 initialized.</div>
                   <div>[NOTE] Using Async Fire-and-Forget architecture.</div>
                </div>
             </div>
          </div>

        </div>
      </main>

      {/* SCRIPT */}
      <script dangerouslySetInnerHTML={{ __html: `
        // --- HELPERS ---
        const log = (msg) => {
            const logs = document.getElementById('api-logs');
            const div = document.createElement('div');
            div.innerHTML = \`<span class="opacity-30">[\${new Date().toLocaleTimeString()}]</span> \${msg}\`;
            logs.appendChild(div);
            logs.scrollTop = logs.scrollHeight;
        };

        const setStatus = (status) => {
            const el = document.getElementById('status-badge');
            el.innerText = status.toUpperCase();
            el.className = \`text-[9px] font-mono px-2 py-1 rounded \${status === 'succeeded' ? 'bg-green-900 text-green-400' : status === 'processing' ? 'bg-blue-900 text-blue-400' : 'bg-black text-gray-500'}\`;
        };

        // --- TABS LOGIC (MAIN) ---
        const tabDirector = document.getElementById('tab-director');
        const tabLab = document.getElementById('tab-lab');
        const viewDirector = document.getElementById('director-view');
        const viewManual = document.getElementById('manual-view');

        const switchMainTab = (target) => {
            if(target === 'director') {
                viewDirector.classList.remove('hidden');
                viewManual.classList.add('hidden');
                
                tabDirector.classList.replace('text-gray-400', 'text-white');
                tabDirector.classList.add('bg-purple-600');
                
                tabLab.classList.replace('text-white', 'text-gray-400');
                tabLab.classList.remove('bg-purple-600'); // remove specific active styles
            } else {
                viewDirector.classList.add('hidden');
                viewManual.classList.remove('hidden');
                
                tabLab.classList.replace('text-gray-400', 'text-white');
                // tabLab styles managed via CSS classes mostly
                
                tabDirector.classList.replace('text-white', 'text-gray-400');
                tabDirector.classList.remove('bg-purple-600');
            }
        };

        tabDirector.onclick = () => switchMainTab('director');
        tabLab.onclick = () => switchMainTab('lab');

        // --- MANUAL LAB TABS ---
        const modeVideoBtn = document.getElementById('mode-video');
        const modeImageBtn = document.getElementById('mode-image');
        const videoForm = document.getElementById('video-form');
        const imageForm = document.getElementById('image-form');

        modeVideoBtn.onclick = () => {
            videoForm.classList.remove('hidden');
            imageForm.classList.add('hidden');
            modeVideoBtn.classList.replace('text-gray-400', 'text-white');
            modeVideoBtn.classList.replace('bg-white/5', 'bg-white/10');
            modeVideoBtn.classList.add('shadow-inner');
            modeImageBtn.classList.replace('text-white', 'text-gray-400');
            modeImageBtn.classList.remove('shadow-inner');
        };
        modeImageBtn.onclick = () => {
            videoForm.classList.add('hidden');
            imageForm.classList.remove('hidden');
            modeImageBtn.classList.replace('text-gray-400', 'text-white');
            modeImageBtn.classList.add('shadow-inner');
            modeVideoBtn.classList.replace('text-white', 'text-gray-400');
            modeVideoBtn.classList.remove('shadow-inner');
        };

        // --- FILE UPLOADS ---
        const handleUpload = (inputId, targetInputName) => {
             const el = document.getElementById(inputId);
             if(!el) return;
             el.onchange = (e) => {
                const file = e.target.files[0];
                if(!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const form = el.closest('form');
                    form.querySelector(\`input[name="\${targetInputName}"]\`).value = ev.target.result;
                    log('File loaded: ' + file.name);
                };
                reader.readAsDataURL(file);
            };
        };
        handleUpload('img-upload', 'sourceUrl');
        handleUpload('vid-upload', 'sourceUrl');

        // --- AI DIRECTOR LOGIC (ASYNC POLLING) ---
        document.getElementById('consult-btn').onclick = async () => {
            const idea = document.getElementById('idea-input').value;
            if(!idea) return alert('Please describe your idea.');
            
            const btn = document.getElementById('consult-btn');
            const originalText = btn.innerHTML;
            btn.innerText = 'Thinking...';
            btn.disabled = true;
            
            try {
                log('Consulting AI Director...');
                // 1. Start the Job
                const res = await fetch('/api/v1/ai/consult', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ idea })
                });
                const data = await res.json();
                
                if(!data.success) throw new Error(data.error);
                
                const jobId = data.jobId;
                log(\`AI Job \${jobId} started. Waiting...\`);
                
                // 2. Poll loop
                const poll = setInterval(async () => {
                    try {
                        const s = await (await fetch(\`/api/v1/job/\${jobId}\`)).json();
                        
                        if (s.status === 'succeeded') {
                            clearInterval(poll);
                            log('AI Response Received.');
                            
                            // Parse Result (Handle array or string)
                            const text = Array.isArray(s.output) ? s.output.join('') : s.output;
                            
                            let jsonStr = text.trim();
                            const firstBrace = jsonStr.indexOf('{');
                            const lastBrace = jsonStr.lastIndexOf('}');
                            if (firstBrace !== -1 && lastBrace !== -1) {
                                jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
                            }
                            
                            let analysis;
                            try {
                                analysis = JSON.parse(jsonStr);
                            } catch(e) {
                                console.error("JSON Parse Error:", e, jsonStr);
                                analysis = { 
                                    enhanced_prompt: idea + ", cinematic lighting, high quality, 4k", 
                                    recommended_model: "SVD-XT", 
                                    reasoning: "Raw output received (JSON parse failed).", 
                                    fps: 24, 
                                    camera_angle: "Dynamic" 
                                };
                            }
                            
                            document.getElementById('ai-suggestions').classList.remove('hidden');
                            document.getElementById('sugg-model').innerText = analysis.recommended_model || "SVD-XT";
                            document.getElementById('sugg-reason').innerText = analysis.reasoning || "Best match.";
                            document.getElementById('sugg-tech').innerText = \`Angle: \${analysis.camera_angle || 'Default'} | FPS: \${analysis.fps || 24}\`;
                            document.getElementById('final-prompt').value = analysis.enhanced_prompt;
                            
                            btn.innerHTML = originalText;
                            btn.disabled = false;
                        } else if (s.status === 'failed' || s.status === 'canceled') {
                            clearInterval(poll);
                            throw new Error('AI Generation Failed/Canceled');
                        }
                        // continue polling if processing/starting
                    } catch(e) {
                        clearInterval(poll);
                        log('Polling Error: ' + e.message);
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                    }
                }, 1500); // check every 1.5s
                
            } catch(e) {
                log('AI Error: ' + e.message);
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        };

        document.getElementById('apply-prompt-btn').onclick = () => {
            const prompt = document.getElementById('final-prompt').value;
            document.getElementById('video-prompt').value = prompt;
            switchMainTab('lab');
            modeVideoBtn.click();
            log('Prompt applied to Video Lab.');
        };

        // --- JOB EXECUTION ---
        const startJob = async (endpoint, payload, type) => {
            const loader = document.getElementById('loader');
            const resImg = document.getElementById('result-image');
            const resVid = document.getElementById('result-video');
            const transBtn = document.getElementById('transfer-overlay');
            
            loader.classList.remove('hidden');
            resImg.classList.add('hidden');
            resVid.classList.add('hidden');
            transBtn.classList.add('hidden');
            setStatus('starting');

            try {
                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                if(!data.success) throw new Error(data.error);
                
                log(\`Job \${data.jobId} started.\`);
                setStatus('processing');

                const poll = setInterval(async () => {
                    try {
                        const s = await (await fetch(\`/api/v1/job/\${data.jobId}\`)).json();
                        if(s.status === 'succeeded') {
                            clearInterval(poll);
                            loader.classList.add('hidden');
                            setStatus('succeeded');
                            
                            if(type === 'image') {
                                 resImg.src = s.output;
                                 resImg.classList.remove('hidden');
                                 transBtn.classList.remove('hidden');
                                 document.getElementById('transfer-btn').onclick = () => {
                                     document.getElementById('video-source-url').value = s.output;
                                     switchMainTab('lab');
                                     modeVideoBtn.click();
                                     log('Image transferred to Video Lab.');
                                 };
                            } else {
                                 resVid.src = s.output;
                                 resVid.classList.remove('hidden');
                            }
                            log('Job Complete.');
                        } else if (s.status === 'failed') {
                            clearInterval(poll);
                            loader.classList.add('hidden');
                            setStatus('failed');
                            log('Job Failed.');
                        }
                    } catch(e){
                         console.error(e);
                    }
                }, 3000);
            } catch(e) {
                loader.classList.add('hidden');
                log('Error: ' + e.message);
            }
        };

        document.getElementById('image-form').onsubmit = (e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            startJob('/api/v1/image/process', {
                sourceUrl: fd.get('sourceUrl'),
                action: fd.get('action'),
                scale: Number(fd.get('scale'))
            }, 'image');
        };

        document.getElementById('video-form').onsubmit = (e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            startJob('/api/v1/job/create', {
                params: {
                   useUserImage: true,
                   sourceUrl: fd.get('sourceUrl'),
                   motion_bucket_id: Number(fd.get('motionBucket')),
                   fps: Number(fd.get('fps')),
                   prompt: fd.get('prompt')
                }
            }, 'video');
        };
      `}}></script>
    </div>
  )
})

// --- API ENDPOINTS ---

app.post('/api/v1/ai/consult', async (c) => {
   try {
     const { idea } = await c.req.json();
     
     // Switching to Llama 2 70B Chat (Most Stable/Accessible Hash)
     const modelVersion = "02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3";
     
     const replicateRes = await fetch("https://api.replicate.com/v1/predictions", {
          method: "POST",
          headers: {
            "Authorization": `Token ${c.env.REPLICATE_API_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            version: modelVersion,
            input: {
              prompt: `[INST] Act as a professional Video Director. Analyze this idea: "${idea}". 
              
              Output a valid JSON object with these exact keys:
              {
                "enhanced_prompt": "string",
                "camera_angle": "string",
                "recommended_model": "string",
                "reasoning": "string",
                "fps": 24
              }
              
              IMPORTANT: Output ONLY the JSON object. No intro, no outro, no markdown formatting. [/INST]`,
              max_tokens: 500,
              temperature: 0.7
            },
          }),
        });

      if (replicateRes.status !== 201) {
          const errText = await replicateRes.text();
          return c.json({ success: false, error: `Replicate Error (${replicateRes.status}): ${errText}` });
      }

      const prediction = await replicateRes.json();
      
      // ASYNC RETURN (No waiting)
      return c.json({
          success: true,
          jobId: prediction.id,
          status: "queued"
      });

   } catch(e) {
      return c.json({ success: false, error: e.message });
   }
});

app.post('/api/v1/image/process', async (c) => {
    try {
        const { sourceUrl, action, scale } = await c.req.json();
        let modelVersion = "";
        let inputParams = {};

        if (action === 'upscale') {
            modelVersion = "468f47165b80657f282416a7f6f7969047b4e0a349a4d4517e1e650691430a63"; 
            inputParams = { image: sourceUrl, scale: scale || 4, face_enhance: true };
        } else if (action === 'face_fix') {
            modelVersion = "9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3";
            inputParams = { img: sourceUrl, scale: 2 };
        } else {
            return c.json({ error: "Unknown action" }, 400);
        }

        const replicateRes = await fetch("https://api.replicate.com/v1/predictions", {
          method: "POST",
          headers: {
            "Authorization": `Token ${c.env.REPLICATE_API_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            version: modelVersion,
            input: inputParams
          }),
        });

        const prediction = await replicateRes.json();
        return c.json({
            success: true,
            jobId: prediction.id,
            status: "queued",
            meta: { type: action }
        });
    } catch (e) {
        return c.json({ success: false, error: e.message }, 500);
    }
});

app.post('/api/v1/job/create', async (c) => {
  try {
    const body = await c.req.json()
    const params = body.params || {};
    let sourceUrl = params.sourceUrl || body.sourceUrl;
    
    if (sourceUrl) {
       const modelVersion = "3f0457e4619daac51203dedb472816f3e3d4c0d1f5b8247f3264786a27374a1a"; 
       let motionBucket = params.motion_bucket_id || 127;

       const replicateRes = await fetch("https://api.replicate.com/v1/predictions", {
          method: "POST",
          headers: {
            "Authorization": `Token ${c.env.REPLICATE_API_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            version: modelVersion,
            input: {
              input_image: sourceUrl,
              video_length: "14_frames_with_svd_xt",
              motion_bucket_id: motionBucket,
              frames_per_second: params.fps || 6,
              cond_aug: 0.02
            },
          }),
        });
        
        const prediction = await replicateRes.json();
        if (replicateRes.status !== 201) {
           const err = await replicateRes.text();
           return c.json({ error: "Provider Error", details: err }, 500)
        }

        return c.json({
          success: true,
          jobId: prediction.id,
          status: "queued",
          meta: { type: "img2video", params: params }
        })
    } else {
        return c.json({ success: false, error: "Source image required." }, 400)
    }
  } catch (e) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

app.get('/api/v1/job/:id', async (c) => {
  const id = c.req.param('id')
  if (!c.env.REPLICATE_API_TOKEN) return c.json({error: "Config Error"}, 500);
  const replicateRes = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
    headers: { "Authorization": `Token ${c.env.REPLICATE_API_TOKEN}` },
  });
  const prediction = await replicateRes.json();
  return c.json({
    jobId: prediction.id,
    status: prediction.status,
    output: prediction.output,
    completed_at: prediction.completed_at
  })
})

app.get('/favicon.ico', (c) => c.body(null, 204))

export default app
