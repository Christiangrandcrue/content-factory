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
        <header class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-white/10 pb-6 gap-4">
          <div>
            <h1 class="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-2">
              CONTENT_FACTORY<span class="text-purple-500">.API</span>
            </h1>
            <div class="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold">
              <span class="px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded">System Online</span>
              <span class="text-gray-500">Env: Production</span>
              <span class="text-gray-500">Region: Earth/Edge</span>
            </div>
          </div>
          <div class="text-right hidden md:block">
            <div class="text-[10px] text-gray-500 mb-1">API ENDPOINT</div>
            <div class="text-xs text-purple-400 bg-purple-500/5 px-3 py-1 rounded border border-purple-500/20">
              POST /api/v1/job/create
            </div>
          </div>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: TEST LAB (PLAYGROUND) */}
          <div class="lg:col-span-7 space-y-6">
            <div class="bg-[#111] border border-white/10 rounded-sm overflow-hidden shadow-2xl">
              <div class="bg-white/5 px-4 py-2 border-b border-white/10 flex justify-between items-center">
                <h3 class="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                  Generation Lab
                </h3>
                <span class="text-[10px] text-gray-500">INTERNAL_TESTER</span>
              </div>
              
              <div class="p-6 space-y-6">
                <form id="test-form" class="space-y-6">
                  
                  {/* Model Select */}
                  <div class="space-y-2">
                    <label class="text-[10px] uppercase text-gray-500 font-bold">Neural Model</label>
                    <select name="model" class="w-full bg-black border border-white/20 text-white p-3 text-sm focus:border-purple-500 focus:outline-none transition-colors rounded-sm appearance-none">
                      <option value="svd-xt">Stable Video Diffusion (SVD-XT 1.1) [Recommended]</option>
                      <option value="animate-diff" disabled>AnimateDiff v3 (Coming Soon)</option>
                      <option value="kandinsky" disabled>Kandinsky Video (Coming Soon)</option>
                    </select>
                  </div>

                  {/* Image URL */}
                  <div class="space-y-2">
                     <label class="text-[10px] uppercase text-gray-500 font-bold">Source Image URL</label>
                     <div class="flex gap-2">
                        <input type="url" name="sourceUrl" required placeholder="https://..." 
                               class="flex-1 bg-black border border-white/20 text-white p-3 text-sm focus:border-purple-500 focus:outline-none transition-colors rounded-sm font-mono" />
                        <button type="button" id="paste-btn" class="px-3 py-2 bg-white/5 border border-white/10 text-[10px] hover:bg-white/10">PASTE</button>
                     </div>
                  </div>

                  {/* Params Grid */}
                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="text-[10px] uppercase text-gray-500 font-bold">Motion Bucket (1-255)</label>
                        <input type="number" name="motionBucket" value="127" min="1" max="255"
                               class="w-full bg-black border border-white/20 text-white p-3 text-sm focus:border-purple-500 focus:outline-none transition-colors rounded-sm font-mono" />
                    </div>
                    <div class="space-y-2">
                        <label class="text-[10px] uppercase text-gray-500 font-bold">FPS</label>
                         <select name="fps" class="w-full bg-black border border-white/20 text-white p-3 text-sm focus:border-purple-500 focus:outline-none transition-colors rounded-sm appearance-none">
                            <option value="6">6 FPS (Cinematic)</option>
                            <option value="12">12 FPS (Smooth)</option>
                            <option value="24">24 FPS (Realtime)</option>
                        </select>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button type="submit" id="run-test-btn" 
                          class="w-full bg-white text-black py-4 text-sm font-bold uppercase tracking-wider hover:bg-purple-500 hover:text-white transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed">
                      /// Initialize Generation Sequence
                  </button>

                </form>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: OUTPUT & LOGS */}
          <div class="lg:col-span-5 space-y-6">
            
            {/* Visual Output */}
            <div class="bg-[#111] border border-white/10 rounded-sm overflow-hidden shadow-2xl min-h-[200px] flex flex-col">
               <div class="bg-white/5 px-4 py-2 border-b border-white/10">
                  <h3 class="text-xs font-bold text-white uppercase tracking-wider">Output Feed</h3>
               </div>
               <div class="flex-1 relative bg-black/50 flex items-center justify-center p-4">
                  <div id="placeholder" class="text-center opacity-30">
                      <div class="text-4xl mb-2">⦿</div>
                      <div class="text-[10px] font-mono">NO SIGNAL</div>
                  </div>
                  <video id="result-video" class="w-full h-auto hidden rounded border border-white/10" controls loop autoplay muted></video>
                  <div id="loader" class="hidden absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-10">
                      <div class="text-center">
                          <div class="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                          <div class="text-xs font-mono text-purple-400 animate-pulse">RENDERING...</div>
                      </div>
                  </div>
               </div>
            </div>

            {/* API Logs */}
            <div class="bg-[#0f0f0f] border border-white/10 rounded-sm overflow-hidden font-mono text-[10px]">
               <div class="bg-white/5 px-4 py-2 border-b border-white/10 flex justify-between">
                  <h3 class="text-xs font-bold text-white uppercase tracking-wider">System Logs</h3>
                  <button id="clear-logs" class="text-gray-500 hover:text-white">CLEAR</button>
               </div>
               <div id="api-logs" class="p-4 h-[250px] overflow-y-auto space-y-2 text-gray-400 scrollbar-thin scrollbar-thumb-white/20">
                  <div><span class="text-green-500">[SYSTEM]</span> Console ready.</div>
                  <div><span class="text-green-500">[SYSTEM]</span> Waiting for manual trigger...</div>
               </div>
            </div>

          </div>
        </div>

        {/* Integration Footer */}
        <div class="mt-12 pt-8 border-t border-white/10 text-[10px] text-gray-500 font-mono flex justify-between">
          <div>
             SERVICE: <span class="text-white">Content Factory API</span><br/>
             VERSION: 2.1.0-beta
          </div>
          <div class="text-right">
             INTEGRATION KEY: <span class="blur-sm hover:blur-0 transition-all cursor-help">FACTORY_ACCESS_TOKEN</span><br/>
             DOCS: <a href="#" class="text-purple-400 underline">View Spec</a>
          </div>
        </div>

      </main>

      {/* --- CLIENT LOGIC --- */}
      <script dangerouslySetInnerHTML={{ __html: `
        const form = document.getElementById('test-form');
        const logs = document.getElementById('api-logs');
        const video = document.getElementById('result-video');
        const placeholder = document.getElementById('placeholder');
        const loader = document.getElementById('loader');
        const btn = document.getElementById('run-test-btn');

        const log = (msg, type = 'info') => {
            const div = document.createElement('div');
            const ts = new Date().toLocaleTimeString();
            const color = type === 'error' ? 'text-red-500' : type === 'success' ? 'text-green-500' : 'text-blue-400';
            div.innerHTML = \`<span class="opacity-50">[\${ts}]</span> <span class="\${color}">[\${type.toUpperCase()}]</span> \${msg}\`;
            logs.appendChild(div);
            logs.scrollTop = logs.scrollHeight;
        };

        document.getElementById('paste-btn').addEventListener('click', async () => {
            try {
                const text = await navigator.clipboard.readText();
                document.querySelector('input[name="sourceUrl"]').value = text;
            } catch(e) { log('Clipboard access denied', 'error'); }
        });

        document.getElementById('clear-logs').addEventListener('click', () => logs.innerHTML = '');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            btn.disabled = true;
            loader.classList.remove('hidden');
            video.classList.add('hidden');
            placeholder.classList.add('hidden');
            
            const formData = new FormData(form);
            const payload = {
                sourceUrl: formData.get('sourceUrl'),
                model: formData.get('model'),
                params: {
                    useUserImage: true,
                    motion_bucket_id: Number(formData.get('motionBucket')),
                    fps: Number(formData.get('fps'))
                }
            };

            log('Sending generation request...', 'info');

            try {
                // 1. CALL OWN API
                const res = await fetch('/api/v1/job/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await res.json();
                
                if (!data.success) throw new Error(data.error || 'API refused request');
                
                log(\`Job created. ID: \${data.jobId}\`, 'success');
                log(\`Tracking provider: \${data.meta.params?.type}\`, 'info');

                // 2. POLLING
                const poll = setInterval(async () => {
                    try {
                        const statusRes = await fetch(\`/api/v1/job/\${data.jobId}\`);
                        const statusData = await statusRes.json();
                        
                        log(\`Status: \${statusData.status}\`, 'info');

                        if (statusData.status === 'succeeded') {
                            clearInterval(poll);
                            loader.classList.add('hidden');
                            video.src = statusData.output;
                            video.classList.remove('hidden');
                            log('Generation complete. Video loaded.', 'success');
                            btn.disabled = false;
                        } else if (statusData.status === 'failed' || statusData.status === 'canceled') {
                            clearInterval(poll);
                            loader.classList.add('hidden');
                            placeholder.classList.remove('hidden');
                            log('Generation failed on provider side.', 'error');
                            btn.disabled = false;
                        }
                    } catch (err) {
                        log('Polling error: ' + err.message, 'error');
                    }
                }, 3000);

            } catch (error) {
                log(error.message, 'error');
                btn.disabled = false;
                loader.classList.add('hidden');
            }
        });
      `}}></script>
    </div>
  )
})

// --- API LOGIC ---

// 1. Create Job Endpoint (Updated for Smart Inputs)
app.post('/api/v1/job/create', async (c) => {
  try {
    const body = await c.req.json()
    
    // Support both old structure (direct sourceUrl) and new structure (params object)
    const params = body.params || {};
    const legacyUrl = body.sourceUrl;
    
    const useUserImage = params.useUserImage ?? !!legacyUrl;
    let sourceUrl = params.sourceUrl || legacyUrl;
    
    // LOGIC FORK:
    
    // CASE 1: USER PROVIDED PHOTO
    if (useUserImage && sourceUrl) {
       // We proceed with Image-to-Video (SVD)
       const modelVersion = "3f0457e4619daac51203dedb472816f3e3d4c0d1f5b8247f3264786a27374a1a"; 
       
       // Map "Style" or "Topic" to Motion settings if needed
       let motionBucket = 127;
       if (params.style === 'Dynamic' || params.style === 'Action') motionBucket = 180;
       if (params.style === 'Calm' || params.style === 'Minimalist') motionBucket = 80;

       // Use explicit motion bucket from request if provided (dev console)
       if (params.motion_bucket_id) motionBucket = params.motion_bucket_id;

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
          meta: {
            type: "img2video",
            params: params
          }
        })
    } 
    
    // CASE 2: NO PHOTO (TEXT TO VIDEO FLOW)
    else {
        return c.json({ 
            success: false, 
            error: "Text-to-Video generation (No Image) is currently in beta. Please provide a source image.",
            required_action: "upload_image"
        }, 400)
    }

  } catch (e) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

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
    output: prediction.output,
    completed_at: prediction.completed_at
  })
})

export default app
