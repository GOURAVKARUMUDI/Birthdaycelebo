"use client";

import React, { useState } from "react";
import { useEditorStore, BlockConfig } from "@/lib/store/editorStore";
import { 
  Sliders, Copy, Code, Sparkles, Check, AlertCircle, 
  Trash2, Lock, EyeOff 
} from "lucide-react";

export default function RightPanel() {
  const {
    pages,
    selectedPageId,
    selectedBlockId,
    updateBlock,
    deleteBlock,
    toggleHideBlock,
    toggleLockBlock,
    duplicateBlock
  } = useEditorStore() as any;

  const [rightTab, setRightTab] = useState<
    "properties" | "style" | "animation" | "responsive" | "events" | "visibility" | "accessibility" | "developer"
  >("properties");

  const [copiedId, setCopiedId] = useState(false);

  // Get selected block
  const activePage = pages.find((p: any) => p.id === selectedPageId) || pages[0];
  const selectedBlock = activePage?.blocks?.find((b: any) => b.id === selectedBlockId) || null;

  if (!selectedBlock) {
    return (
      <aside className="w-[300px] border-l border-gray-200 bg-white p-6 flex flex-col justify-center items-center text-center font-sans text-xs text-gray-400 select-none shrink-0">
        <Sliders size={36} className="text-gray-300 mb-3 animate-pulse" />
        <h4 className="font-bold text-gray-500 uppercase tracking-widest font-nunito mb-1">Inspector Panel</h4>
        <p className="max-w-[200px] leading-relaxed">
          Select any element on the design canvas to configure its content, styles, and animation properties.
        </p>
      </aside>
    );
  }

  const isLocked = !!selectedBlock.properties?.locked;
  const isHidden = !!selectedBlock.properties?.hidden;

  const handleCopyId = () => {
    navigator.clipboard.writeText(selectedBlock.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 1500);
  };

  const updateProp = (key: string, value: any) => {
    if (isLocked) return;
    updateBlock(selectedBlock.id, {
      properties: { ...selectedBlock.properties, [key]: value }
    });
  };

  const updateStyle = (key: string, value: any) => {
    if (isLocked) return;
    updateBlock(selectedBlock.id, {
      styles: { ...selectedBlock.styles, [key]: value }
    });
  };

  const updateAnim = (key: string, value: any) => {
    if (isLocked) return;
    updateBlock(selectedBlock.id, {
      animation: { ...selectedBlock.animation, [key]: value }
    });
  };

  return (
    <aside className="w-[300px] border-l border-gray-200 bg-white flex flex-col z-20 shadow-sm select-none font-sans shrink-0">
      
      {/* Inspector tabs headers scrolling list */}
      <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar text-[9px] font-bold text-gray-400 p-1 bg-gray-50/50 gap-0.5 shrink-0">
        {[
          { id: "properties", label: "Props" },
          { id: "style", label: "Style" },
          { id: "animation", label: "Motion" },
          { id: "responsive", label: "Resp" },
          { id: "events", label: "Events" },
          { id: "visibility", label: "Hide" },
          { id: "accessibility", label: "A11y" },
          { id: "developer", label: "Dev" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setRightTab(tab.id as any)}
            className={`py-1.5 px-2 rounded-md transition-all shrink-0 ${
              rightTab === tab.id 
                ? "bg-white text-purple shadow-sm border border-pink-100 font-black" 
                : "hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Locked element alert notification */}
      {isLocked && rightTab !== "developer" && rightTab !== "visibility" && (
        <div className="mx-4 mt-3 bg-amber-50 border border-amber-100 rounded-xl p-3 text-[10px] leading-relaxed text-amber-700 font-bold flex items-center gap-1.5">
          <Lock size={12} className="shrink-0 text-amber-500 animate-pulse" />
          <span>Locked. Unlock under "Dev" tab to edit values.</span>
        </div>
      )}

      {/* Inspector body content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        
        <fieldset disabled={isLocked && rightTab !== "developer" && rightTab !== "visibility"} className="space-y-4">
          
          {/* ================= TAB 1: PROPERTIES ================= */}
          {rightTab === "properties" && (
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-nunito">Block Properties</h4>
              
              {/* Countdown Properties */}
              {selectedBlock.type === "countdown" && (
                <div className="space-y-3.5 text-xs text-gray-500">
                  <div>
                    <label className="block mb-1 font-bold">Target Deadline</label>
                    <input
                      type="datetime-local"
                      value={selectedBlock.properties.targetDate ? selectedBlock.properties.targetDate.slice(0, 16) : ""}
                      onChange={(e) => updateProp("targetDate", new Date(e.target.value).toISOString())}
                      className="w-full px-3 py-1.5 border border-pink-100 rounded-xl text-xs bg-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Mascot Properties */}
              {selectedBlock.type === "mascot" && (
                <div className="space-y-3.5 text-xs text-gray-500">
                  <div>
                    <label className="block mb-1 font-bold">Select Animal Species</label>
                    <select
                      value={selectedBlock.properties.type || "giraffe"}
                      onChange={(e) => updateProp("type", e.target.value)}
                      className="w-full px-3 py-1.5 border border-pink-100 bg-white rounded-xl text-xs focus:outline-none"
                    >
                      <option value="giraffe">🦒 Giraffe</option>
                      <option value="panda">🐼 Panda</option>
                      <option value="bear">🐻 Teddy Bear</option>
                      <option value="cat">🐱 Cat</option>
                      <option value="dog">🐶 Puppy</option>
                      <option value="bunny">🐰 Bunny</option>
                      <option value="fox">🦊 Fox</option>
                      <option value="penguin">🐧 Penguin</option>
                      <option value="koala">🐨 Koala</option>
                      <option value="sloth">🦥 Sloth</option>
                      <option value="hamster">🐹 Hamster</option>
                      <option value="elephant">🐘 Elephant</option>
                      <option value="tiger">🐯 Tiger Cub</option>
                      <option value="lion">🦁 Lion Cub</option>
                      <option value="dinosaur">🦖 Dinosaur</option>
                      <option value="unicorn">🦄 Unicorn</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-bold">Pose State</label>
                    <select
                      value={selectedBlock.properties.state || "idle"}
                      onChange={(e) => updateProp("state", e.target.value)}
                      className="w-full px-3 py-1.5 border border-pink-100 bg-white rounded-xl text-xs focus:outline-none"
                    >
                      <option value="idle">Idle blinking</option>
                      <option value="smile">Smile</option>
                      <option value="wave">Wave</option>
                      <option value="jump">Jump</option>
                      <option value="dance">Dance</option>
                      <option value="celebrate">Celebrate</option>
                      <option value="cry">Cry</option>
                      <option value="sleep">Sleep</option>
                      <option value="hold_flowers">Hold Flowers</option>
                      <option value="hold_cake">Hold Cake</option>
                      <option value="hold_balloons">Hold Balloons</option>
                      <option value="hold_gift">Hold Gift</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">Mascot Size</label>
                    <input
                      type="range"
                      min="100"
                      max="220"
                      value={selectedBlock.properties.size || 150}
                      onChange={(e) => updateProp("size", Number(e.target.value))}
                      className="w-full accent-purple"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Companion Caption</label>
                    <input
                      type="text"
                      value={selectedBlock.properties.caption || ""}
                      onChange={(e) => updateProp("caption", e.target.value)}
                      placeholder="E.g., Tap me to celebrate!"
                      className="w-full px-3 py-1.5 border border-pink-100 rounded-xl text-xs focus:outline-none bg-white font-nunito"
                    />
                  </div>
                  <label className="flex items-center gap-2 select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!selectedBlock.properties.enableBirthdayOutfit}
                      onChange={(e) => updateProp("enableBirthdayOutfit", e.target.checked)}
                      className="accent-purple rounded"
                    />
                    <span>Wear Birthday Party Hat</span>
                  </label>
                </div>
              )}

              {/* Heading Properties */}
              {selectedBlock.type === "heading" && (
                <div className="space-y-3.5 text-xs text-gray-500">
                  <div>
                    <label className="block mb-1 font-bold">Section Title</label>
                    <input
                      type="text"
                      value={selectedBlock.properties.title || ""}
                      onChange={(e) => updateProp("title", e.target.value)}
                      className="w-full px-3 py-1.5 border border-pink-100 rounded-xl text-xs bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={selectedBlock.properties.subtitle || ""}
                      onChange={(e) => updateProp("subtitle", e.target.value)}
                      className="w-full px-3 py-1.5 border border-pink-100 rounded-xl text-xs bg-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Text Properties */}
              {selectedBlock.type === "text" && (
                <div className="space-y-3.5 text-xs text-gray-500">
                  <div>
                    <label className="block mb-1 font-bold">Body Text</label>
                    <textarea
                      rows={6}
                      value={selectedBlock.properties.text || ""}
                      onChange={(e) => updateProp("text", e.target.value)}
                      className="w-full px-3 py-1.5 border border-pink-100 rounded-xl text-xs bg-white focus:outline-none font-nunito"
                    />
                  </div>
                </div>
              )}

              {/* Quote Properties */}
              {selectedBlock.type === "quote" && (
                <div className="space-y-3.5 text-xs text-gray-500">
                  <div>
                    <label className="block mb-1 font-bold">Quote Message</label>
                    <textarea
                      rows={4}
                      value={selectedBlock.properties.quote || ""}
                      onChange={(e) => updateProp("quote", e.target.value)}
                      className="w-full px-3 py-1.5 border border-pink-100 rounded-xl text-xs bg-white focus:outline-none font-nunito"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Author Name</label>
                    <input
                      type="text"
                      value={selectedBlock.properties.author || ""}
                      onChange={(e) => updateProp("author", e.target.value)}
                      className="w-full px-3 py-1.5 border border-pink-100 rounded-xl text-xs bg-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Spotify/YouTube/Image Embed URL */}
              {(selectedBlock.type === "spotify" || selectedBlock.type === "youtube" || selectedBlock.type === "image") && (
                <div className="space-y-3.5 text-xs text-gray-500">
                  <div>
                    <label className="block mb-1 font-bold">
                      {selectedBlock.type === "image" ? "Image URL" : "Embed Frame URL"}
                    </label>
                    <input
                      type="text"
                      value={selectedBlock.properties.embedUrl || selectedBlock.properties.imageUrl || ""}
                      onChange={(e) => updateProp(selectedBlock.type === "image" ? "imageUrl" : "embedUrl", e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-1.5 border border-pink-100 rounded-xl text-xs bg-white focus:outline-none font-mono"
                    />
                  </div>
                  {selectedBlock.type === "image" && (
                    <div>
                      <label className="block mb-1">Image Caption</label>
                      <input
                        type="text"
                        value={selectedBlock.properties.caption || ""}
                        onChange={(e) => updateProp("caption", e.target.value)}
                        className="w-full px-3 py-1.5 border border-pink-100 rounded-xl text-xs bg-white focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 2: STYLE ================= */}
          {rightTab === "style" && (
            <div className="space-y-4 text-xs text-gray-500">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-nunito">Spacing & Style</h4>
              
              <div>
                <label className="flex justify-between items-center mb-1">
                  <span>Padding (Vertical)</span>
                  <span className="font-mono text-[10px]">{selectedBlock.styles.padding || "16px"}</span>
                </label>
                <select
                  value={selectedBlock.styles.padding || "16px"}
                  onChange={(e) => updateStyle("padding", e.target.value)}
                  className="w-full px-3 py-1.5 border border-pink-100 bg-white rounded-xl text-xs focus:outline-none"
                >
                  <option value="4px">4px (X-Small)</option>
                  <option value="8px">8px (Small)</option>
                  <option value="16px">16px (Normal)</option>
                  <option value="24px">24px (Medium)</option>
                  <option value="32px">32px (Large)</option>
                  <option value="48px">48px (X-Large)</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Text Alignment</label>
                <div className="grid grid-cols-3 border border-pink-100 rounded-xl overflow-hidden text-center text-xs">
                  {["left", "center", "right"].map((align) => (
                    <button
                      key={align}
                      onClick={() => updateStyle("textAlign", align)}
                      className={`py-1.5 transition-all ${
                        selectedBlock.styles.textAlign === align 
                          ? "bg-purple text-white font-bold" 
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      {align}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-[1px] bg-gray-100" />

              <div>
                <label className="block mb-1">Font Size Override</label>
                <input
                  type="text"
                  value={selectedBlock.styles.fontSize || ""}
                  onChange={(e) => updateStyle("fontSize", e.target.value)}
                  placeholder="E.g. 1.25rem, 16px"
                  className="w-full px-3 py-1.5 border border-pink-100 rounded-xl text-xs focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block mb-1">Block Card Background Override</label>
                <input
                  type="text"
                  value={selectedBlock.styles.backgroundColor || ""}
                  onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                  placeholder="E.g. rgba(255,255,255,0.8), #FFF"
                  className="w-full px-3 py-1.5 border border-pink-100 rounded-xl text-xs focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block mb-1">Text Color Override</label>
                <input
                  type="text"
                  value={selectedBlock.styles.color || ""}
                  onChange={(e) => updateStyle("color", e.target.value)}
                  placeholder="E.g. #333, #7C4DFF"
                  className="w-full px-3 py-1.5 border border-pink-100 rounded-xl text-xs focus:outline-none font-mono"
                />
              </div>
            </div>
          )}

          {/* ================= TAB 3: MOTION/ANIMATION ================= */}
          {rightTab === "animation" && (
            <div className="space-y-4 text-xs text-gray-500">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-nunito">Entrance Animation</h4>
              
              <div>
                <label className="block mb-1">Entrance Transition Effect</label>
                <select
                  value={selectedBlock.animation.type || "slide-up"}
                  onChange={(e) => updateAnim("type", e.target.value)}
                  className="w-full px-3 py-1.5 border border-pink-100 bg-white rounded-xl text-xs focus:outline-none"
                >
                  <option value="fade">Fade in (smooth)</option>
                  <option value="slide-up">Slide Up</option>
                  <option value="scale">Scale up zoom</option>
                  <option value="bounce">Drop Bounce</option>
                  <option value="float">Continuous Floating hover</option>
                  <option value="sway">Continuous Sway rotation</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Motion Physics Curve</label>
                <select
                  value={selectedBlock.animation.physics || "tween"}
                  onChange={(e) => updateAnim("physics", e.target.value)}
                  className="w-full px-3 py-1.5 border border-pink-100 bg-white rounded-xl text-xs focus:outline-none"
                >
                  <option value="tween">Ease In/Out (tween)</option>
                  <option value="spring">Spring elasticity</option>
                  <option value="bounce">High bounce physics</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1">Duration (s)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="10"
                    value={selectedBlock.animation.duration !== undefined ? selectedBlock.animation.duration : 0.6}
                    onChange={(e) => updateAnim("duration", Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-pink-100 rounded-xl text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1">Delay (s)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={selectedBlock.animation.delay || 0}
                    onChange={(e) => updateAnim("delay", Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-pink-100 rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 select-none cursor-pointer mt-2">
                <input
                  type="checkbox"
                  checked={!!selectedBlock.animation.loop}
                  onChange={(e) => updateAnim("loop", e.target.checked)}
                  className="accent-purple rounded"
                />
                <span>Loop Motion Infinitely</span>
              </label>
            </div>
          )}

          {/* ================= TAB 4: RESPONSIVE OVERRIDES ================= */}
          {rightTab === "responsive" && (
            <div className="space-y-4 text-xs text-gray-500">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-nunito">Responsive Values</h4>
              
              <div className="bg-pink-50/50 border border-pink-100 rounded-xl p-3 text-[11px] leading-relaxed text-purple-700">
                <AlertCircle size={14} className="inline mr-1.5 shrink-0 text-purple" />
                Responsive overrides allow configuring properties (such as padding or visibility) independently for mobile, tablet, and desktop screens.
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block mb-1 font-bold">Desktop Layout Padding</label>
                  <input type="text" placeholder="E.g. 48px" className="w-full px-3 py-1.5 border border-pink-100 rounded-xl text-xs bg-white focus:outline-none" />
                </div>
                <div>
                  <label className="block mb-1 font-bold">Tablet Layout Padding</label>
                  <input type="text" placeholder="E.g. 32px" className="w-full px-3 py-1.5 border border-pink-100 rounded-xl text-xs bg-white focus:outline-none" />
                </div>
                <div>
                  <label className="block mb-1 font-bold">Mobile Layout Padding</label>
                  <input type="text" placeholder="E.g. 16px" className="w-full px-3 py-1.5 border border-pink-100 rounded-xl text-xs bg-white focus:outline-none" />
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 5: EVENTS ================= */}
          {rightTab === "events" && (
            <div className="space-y-4 text-xs text-gray-500">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-nunito">Interaction Events</h4>
              
              <div>
                <label className="block mb-1">Click Action Sound Effect</label>
                <select
                  value={selectedBlock.properties.sfx || "none"}
                  onChange={(e) => updateProp("sfx", e.target.value)}
                  className="w-full px-3 py-1.5 border border-pink-100 bg-white rounded-xl text-xs focus:outline-none"
                >
                  <option value="none">No click sound</option>
                  <option value="click">Cute bubble click</option>
                  <option value="success">Success magic bell</option>
                  <option value="error">Error cartoon buzz</option>
                </select>
              </div>

              <label className="flex items-center gap-2 select-none cursor-pointer mt-2">
                <input
                  type="checkbox"
                  checked={!!selectedBlock.properties.triggerConfetti}
                  onChange={(e) => updateProp("triggerConfetti", e.target.checked)}
                  className="accent-purple rounded"
                />
                <span>Trigger Confetti Explosion on click</span>
              </label>
            </div>
          )}

          {/* ================= TAB 6: VISIBILITY ================= */}
          {rightTab === "visibility" && (
            <div className="space-y-4 text-xs text-gray-500">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-nunito">Visibility Settings</h4>
              
              {/* Hide block on production toggle */}
              <label className="flex items-center gap-2 select-none cursor-pointer p-2 border border-pink-100 bg-pink-50/20 rounded-xl mb-3">
                <input
                  type="checkbox"
                  checked={isHidden}
                  onChange={() => toggleHideBlock(selectedPageId, selectedBlock.id)}
                  className="accent-purple rounded"
                />
                <div className="text-[11px]">
                  <span className="font-bold text-gray-700 block">Hide block from visitors</span>
                  <span className="text-gray-400">Keep it inside editor canvas but hide in live view</span>
                </div>
              </label>

              <div className="h-[1px] bg-gray-100 my-2" />

              <div className="space-y-2.5">
                <label className="flex items-center gap-2 select-none cursor-pointer">
                  <input type="checkbox" className="accent-purple rounded" />
                  <span>Hide on Mobile viewports (&lt; 640px)</span>
                </label>
                <label className="flex items-center gap-2 select-none cursor-pointer">
                  <input type="checkbox" className="accent-purple rounded" />
                  <span>Hide on Tablet viewports (640px - 1024px)</span>
                </label>
                <label className="flex items-center gap-2 select-none cursor-pointer">
                  <input type="checkbox" className="accent-purple rounded" />
                  <span>Hide on Desktop viewports (&gt; 1024px)</span>
                </label>
              </div>
            </div>
          )}

          {/* ================= TAB 7: ACCESSIBILITY ================= */}
          {rightTab === "accessibility" && (
            <div className="space-y-4 text-xs text-gray-500">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-nunito">Accessibility (A11y)</h4>
              
              <div>
                <label className="block mb-1">ARIA Screen-Reader Label</label>
                <input
                  type="text"
                  value={selectedBlock.properties.ariaLabel || ""}
                  onChange={(e) => updateProp("ariaLabel", e.target.value)}
                  placeholder="E.g. Sweet birthday message scroll"
                  className="w-full px-3 py-1.5 border border-pink-100 rounded-xl text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1">Image Alternate Text (Alt)</label>
                <input
                  type="text"
                  value={selectedBlock.properties.altText || ""}
                  onChange={(e) => updateProp("altText", e.target.value)}
                  placeholder="Description of the media..."
                  className="w-full px-3 py-1.5 border border-pink-100 rounded-xl text-xs focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* ================= TAB 8: DEVELOPER RAW ================= */}
          {rightTab === "developer" && (
            <div className="space-y-4 text-xs text-gray-500">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-nunito">Developer Settings</h4>
              
              {/* Lock toggle selector */}
              <label className="flex items-center gap-2 select-none cursor-pointer p-2 border border-amber-100 bg-amber-50/20 rounded-xl mb-3">
                <input
                  type="checkbox"
                  checked={isLocked}
                  onChange={() => toggleLockBlock(selectedPageId, selectedBlock.id)}
                  className="accent-purple rounded"
                />
                <div className="text-[11px]">
                  <span className="font-bold text-amber-700 block flex items-center gap-1">
                    <Lock size={10} /> Lock Component values
                  </span>
                  <span className="text-gray-400">Lock element dimensions to avoid accidental edits</span>
                </div>
              </label>

              <div className="h-[1px] bg-gray-100 my-2" />

              <div>
                <label className="block mb-1">Unique Identifier (Block ID)</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={selectedBlock.id}
                    className="flex-1 px-3 py-1.5 border border-pink-100 bg-gray-50 text-[10px] font-mono rounded-xl focus:outline-none"
                  />
                  <button
                    onClick={handleCopyId}
                    className="p-2 border border-pink-100 hover:bg-gray-50 rounded-xl"
                  >
                    {copiedId ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block mb-1">Custom CSS Class Names</label>
                <input
                  type="text"
                  placeholder="E.g. custom-shadow bounce-card"
                  className="w-full px-3 py-1.5 border border-pink-100 rounded-xl text-[10px] font-mono focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Code size={12} />
                  <span className="font-bold">Raw JSON Schema</span>
                </div>
                <pre className="p-3 bg-gray-900 text-gray-200 rounded-xl text-[8px] font-mono overflow-auto max-h-[140px] no-scrollbar">
                  {JSON.stringify(selectedBlock, null, 2)}
                </pre>
              </div>
            </div>
          )}

        </fieldset>

        {/* Delete Block / Duplicate Block */}
        <div className="pt-2 border-t border-gray-100 flex flex-col gap-2 shrink-0">
          <button
            onClick={() => duplicateBlock(selectedPageId, selectedBlock.id)}
            className="w-full py-2 bg-purple/10 hover:bg-purple/20 text-purple font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all select-none"
          >
            <Copy size={12} /> Duplicate Block
          </button>
          
          <button
            disabled={isLocked}
            onClick={() => deleteBlock(selectedBlock.id)}
            className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all select-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={12} /> {isLocked ? "Block is Locked 🔒" : "Delete Content Block"}
          </button>
        </div>

      </div>
    </aside>
  );
}
