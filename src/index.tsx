import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { renderer } from './renderer'

type Bindings = {
  REPLICATE_API_TOKEN: string
  FACTORY_ACCESS_TOKEN: string
}

const app = new Hono<{ Bindings: Bindings }>()

// CORS Configuration
app.use('/api/*', cors({
  origin: ['https://ads.synthnova.me', 'http://localhost:3000'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Factory-Secret'],
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
}))

app.use(renderer)

// --- UI: DEVELOPER CONSOLE & PLAYGROUND ---
app.get('/', (c) => {
  return c.render(
    <div class="min-h-screen bg-[#0a0a0a] text-gray-300 font-mono selection:bg-purple-900 selection:text-white">
      {/* Matrix Grid Background */}
      <div class="fixed inset-0 opacity-[0.03] pointer-events-none" 
           style={{backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)', backgroundSize: '50px 50px'}}>
      </div>

      <main class="relative z-10 w-full max-w-7xl mx-auto p-6 md:p-12">
        
        {/* Header Status Bar */}
        <header class="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-white/10 pb-6 gap-4">
          <div>
            <h1 class="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-2">
              CONTENT_FACTORY<span class="text-purple-500">.API</span>
            </h1>
            <div class="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold">
              <span class="px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded">System Online</span>
              <span class="text-gray-500">v3.0 Full Cycle</span>
            </div>
          </div>
          
          {/* Mode Switcher */}
          <div class="flex bg-white/5 p-1 rounded border border-white/10">
            <button id="mode-video" class="px-4 py-1 text-xs font-bold text-black bg-white rounded shadow-sm transition-all">VIDEO LAB</button>
            <button id="mode-image" class="px-4 py-1 text-xs font-bold text-gray-400 hover:text-white transition-all">IMAGE LAB</button>
          </div>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: CONTROLS */}
          <div class="lg:col-span-7 space-y-6">
            
            {/* VIDEO FORM (Default) */}
            <div id="video-panel" class="bg-[#111] border border-white/10 rounded-sm overflow-hidden shadow-2xl transition-all">
              <div class="bg-purple-900/20 px-4 py-2 border-b border-white/10 flex justify-between items-center">
                <h3 class="text-xs font-bold text-purple-400 uppercase tracking-wider">/// Video Generation</h3>
                <span class="text-[10px] text-gray-500">POST /api/v1/job/create</span>
              </div>
              <div class="p-6 space-y-6">
                <form id="test-form" class="space-y-6">
                  <div class="space-y-2">
                     <label class="text-[10px] uppercase text-gray-500 font-bold">Source Image URL</label>
                     <div class="flex gap-2">
                        <input type="url" name="sourceUrl" required placeholder="https://..." 
                               class="flex-1 bg-black border border-white/20 text-white p-3 text-sm focus:border-purple-500 focus:outline-none transition-colors rounded-sm font-mono" />
                        <button type="button" class="paste-btn px-3 py-2 bg-white/5 border border-white/10 text-[10px] hover:bg-white/10">PASTE</button>
                     </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="text-[10px] uppercase text-gray-500 font-bold">Motion (1-255)</label>
                        <input type="number" name="motionBucket" value="127" class="w-full bg-black border border-white/20 text-white p-3 text-sm rounded-sm font-mono" />
                    </div>
                    <div class="space-y-2">
                        <label class="text-[10px] uppercase text-gray-500 font-bold">FPS</label>
                         <select name="fps" class="w-full bg-black border border-white/20 text-white p-3 text-sm rounded-sm">
                            <option value="6">6 FPS</option>
                            <option value="12">12 FPS</option>
                            <option value="24">24 FPS</option>
                        </select>
                    </div>
                  </div>
                  <button type="submit" class="w-full bg-white text-black py-4 text-sm font-bold uppercase tracking-wider hover:bg-purple-500 hover:text-white transition-all">
                      /// Animate Video
                  </button>
                </form>
              </div>
            </div>

            {/* IMAGE FORM (Hidden by default) */}
            <div id="image-panel" class="hidden bg-[#111] border border-white/10 rounded-sm overflow-hidden shadow-2xl transition-all">
              <div class="bg-blue-900/20 px-4 py-2 border-b border-white/10 flex justify-between items-center">
                <h3 class="text-xs font-bold text-blue-400 uppercase tracking-wider">/// Image Processor</h3>
                <span class="text-[10px] text-gray-500">POST /api/v1/image/process</span>
              </div>
              <div class="p-6 space-y-6">
                <form id="image-form" class="space-y-6">
                  <div class="space-y-2">
                     <label class="text-[10px] uppercase text-gray-500 font-bold">Source Image URL</label>
                     <div class="flex gap-2">
                        <input type="url" name="sourceUrl" required placeholder="https://..." 
                               class="flex-1 bg-black border border-white/20 text-white p-3 text-sm focus:border-blue-500 focus:outline-none transition-colors rounded-sm font-mono" />
                        <button type="button" class="paste-btn px-3 py-2 bg-white/5 border border-white/10 text-[10px] hover:bg-white/10">PASTE</button>
                     </div>
                  </div>
                  
                  <div class="space-y-2">
                    <label class="text-[10px] uppercase text-gray-500 font-bold">Action</label>
                    <select name="action" class="w-full bg-black border border-white/20 text-white p-3 text-sm focus:border-blue-500 focus:outline-none transition-colors rounded-sm">
                      <option value="upscale">Upscale (Real-ESRGAN 4x)</option>
                      <option value="face_fix">Face Restoration (GFPGAN)</option>
                      <option value="style" disabled>Style Transfer (Coming Soon)</option>
                    </select>
                  </div>

                  <div class="space-y-2">
                     <label class="text-[10px] uppercase text-gray-500 font-bold">Scale Factor</label>
                     <select name="scale" class="w-full bg-black border border-white/20 text-white p-3 text-sm rounded-sm">
                        <option value="2">2x</option>
                        <option value="4" selected>4x (Default)</option>
                     </select>
                  </div>

                  <button type="submit" class="w-full bg-white text-black py-4 text-sm font-bold uppercase tracking-wider hover:bg-blue-500 hover:text-white transition-all">
                      /// Process Image
                  </button>
                </form>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: OUTPUT & LOGS */}
          <div class="lg:col-span-5 space-y-6">
            <div class="bg-[#111] border border-white/10 rounded-sm overflow-hidden shadow-2xl min-h-[300px] flex flex-col">
               <div class="bg-white/5 px-4 py-2 border-b border-white/10">
                  <h3 class="text-xs font-bold text-white uppercase tracking-wider">Output Feed</h3>
               </div>
               <div class="flex-1 relative bg-black/50 flex items-center justify-center p-4">
                  <div id="placeholder" class="text-center opacity-30">
                      <div class="text-4xl mb-2">⦿</div>
                      <div class="text-[10px] font-mono">NO SIGNAL</div>
                  </div>
                  <video id="result-video" class="w-full h-auto hidden rounded border border-white/10" controls loop autoplay muted></video>
                  <img id="result-image" class="w-full h-auto hidden rounded border border-white/10 object-contain" />
                  
                  <div id="loader" class="hidden absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-10">
                      <div class="text-center">
                          <div class="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
                          <div class="text-xs font-mono text-white animate-pulse">PROCESSING...</div>
                      </div>
                  </div>
               </div>
            </div>
            
            <div class="bg-[#0f0f0f] border border-white/10 rounded-sm overflow-hidden font-mono text-[10px] h-[200px]">
               <div id="api-logs" class="p-4 h-full overflow-y-auto space-y-2 text-gray-400">
                  <div><span class="text-green-500">[SYSTEM]</span> Factory Ready. Select Lab Mode.</div>
               </div>
            </div>
          </div>
        </div>
      </main>

      <script dangerouslySetInnerHTML={{ __html: `
        // UI Logic
        const videoPanel = document.getElementById('video-panel');
        const imagePanel = document.getElementById('image-panel');
        const modeVideoBtn = document.getElementById('mode-video');
        const modeImageBtn = document.getElementById('mode-image');
        
        // Switching Modes
        modeVideoBtn.onclick = () => {
            videoPanel.classList.remove('hidden');
            imagePanel.classList.add('hidden');
            modeVideoBtn.classList.replace('text-gray-400', 'text-black');
            modeVideoBtn.classList.replace('bg-white/5', 'bg-white');
            modeImageBtn.classList.replace('text-black', 'text-gray-400');
            modeImageBtn.classList.replace('bg-white', 'bg-white/5');
        };
        
        modeImageBtn.onclick = () => {
            videoPanel.classList.add('hidden');
            imagePanel.classList.remove('hidden');
            modeImageBtn.classList.replace('text-gray-400', 'text-black');
            modeImageBtn.classList.replace('bg-white/5', 'bg-white');
            modeVideoBtn.classList.replace('text-black', 'text-gray-400');
            modeVideoBtn.classList.replace('bg-white', 'bg-white/5');
        };

        // Shared Logic
        const logs = document.getElementById('api-logs');
        const loader = document.getElementById('loader');
        const placeholder = document.getElementById('placeholder');
        const resultVideo = document.getElementById('result-video');
        const resultImage = document.getElementById('result-image');

        const log = (msg) => {
            const div = document.createElement('div');
            div.innerHTML = \`<span class="opacity-50">[\${new Date().toLocaleTimeString()}]</span> \${msg}\`;
            logs.appendChild(div);
            logs.scrollTop = logs.scrollHeight;
        };

        document.querySelectorAll('.paste-btn').forEach(btn => {
            btn.onclick = async (e) => {
                const input = e.target.previousElementSibling;
                try { input.value = await navigator.clipboard.readText(); } catch(e){}
            }
        });

        // Video Submission
        document.getElementById('test-form').onsubmit = async (e) => {
            e.preventDefault();
            loader.classList.remove('hidden');
            resultVideo.classList.add('hidden');
            resultImage.classList.add('hidden');
            
            const formData = new FormData(e.target);
            const payload = {
                sourceUrl: formData.get('sourceUrl'),
                params: {
                    useUserImage: true,
                    motion_bucket_id: Number(formData.get('motionBucket')),
                    fps: Number(formData.get('fps'))
                }
            };

            log('Starting Video Job...');
            try {
                const res = await fetch('/api/v1/job/create', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                if(!data.success) throw new Error(data.error);
                log('Job ID: ' + data.jobId);
                
                const poll = setInterval(async () => {
                    const s = await (await fetch(\`/api/v1/job/\${data.jobId}\`)).json();
                    log('Status: ' + s.status);
                    if(s.status === 'succeeded') {
                        clearInterval(poll);
                        resultVideo.src = s.output;
                        resultVideo.classList.remove('hidden');
                        loader.classList.add('hidden');
                        log('DONE.');
                    }
                }, 3000);
            } catch(e) {
                log('Error: ' + e.message);
                loader.classList.add('hidden');
            }
        };

        // Image Submission (NEW)
        document.getElementById('image-form').onsubmit = async (e) => {
            e.preventDefault();
            loader.classList.remove('hidden');
            resultVideo.classList.add('hidden');
            resultImage.classList.add('hidden');

            const formData = new FormData(e.target);
            const payload = {
                sourceUrl: formData.get('sourceUrl'),
                action: formData.get('action'),
                scale: Number(formData.get('scale'))
            };

            log('Starting Image Processing (' + payload.action + ')...');
            try {
                const res = await fetch('/api/v1/image/process', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                
                if (data.jobId) {
                    log('Processing ID: ' + data.jobId);
                    const poll = setInterval(async () => {
                        const s = await (await fetch(\`/api/v1/job/\${data.jobId}\`)).json();
                        log('Status: ' + s.status);
                        if(s.status === 'succeeded') {
                            clearInterval(poll);
                            resultImage.src = s.output;
                            resultImage.classList.remove('hidden');
                            loader.classList.add('hidden');
                            log('IMAGE DONE.');
                        }
                    }, 2000);
                } else if (data.output) {
                    // Immediate result fallback
                    resultImage.src = data.output;
                    resultImage.classList.remove('hidden');
                    loader.classList.add('hidden');
                    log('IMAGE DONE.');
                } else {
                    throw new Error(data.error || 'Unknown error');
                }
            } catch(e) {
                log('Error: ' + e.message);
                loader.classList.add('hidden');
            }
        };
      `}}></script>
    </div>
  )
})

// --- API ENDPOINTS ---

// 1. IMAGE PROCESSING (NEW)
app.post('/api/v1/image/process', async (c) => {
    try {
        const { sourceUrl, action, scale } = await c.req.json();
        
        // Model Selector
        let modelVersion = "";
        let inputParams = {};

        if (action === 'upscale') {
            // Real-ESRGAN
            modelVersion = "468f47165b80657f282416a7f6f7969047b4e0a349a4d4517e1e650691430a63"; 
            inputParams = { image: sourceUrl, scale: scale || 4, face_enhance: true };
        } else if (action === 'face_fix') {
            // GFPGAN
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
        
        if (replicateRes.status !== 201) {
           return c.json({ error: "Provider Error", details: prediction }, 500)
        }

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

// 2. VIDEO GENERATION (Create Job)
app.post('/api/v1/job/create', async (c) => {
  try {
    const body = await c.req.json()
    const params = body.params || {};
    const legacyUrl = body.sourceUrl;
    const useUserImage = params.useUserImage ?? !!legacyUrl;
    let sourceUrl = params.sourceUrl || legacyUrl;
    
    if (useUserImage && sourceUrl) {
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
        return c.json({ 
            success: false, 
            error: "Text-to-Video beta. Provide image.",
            required_action: "upload_image"
        }, 400)
    }
  } catch (e) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// 3. STATUS CHECK (Universal)
app.get('/api/v1/job/:id', async (c) => {
  const id = c.req.param('id')
  if (!c.env.REPLICATE_API_TOKEN) return c.json({error: "Config Error"}, 500);

  const replicateRes = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
    headers: {
      "Authorization": `Token ${c.env.REPLICATE_API_TOKEN}`,
    },
  });

  const prediction = await replicateRes.json();

  return c.json({
    jobId: prediction.id,
    status: prediction.status,
    output: prediction.output, // Video URL or Image URL depending on job type
    completed_at: prediction.completed_at
  })
})

export default app
