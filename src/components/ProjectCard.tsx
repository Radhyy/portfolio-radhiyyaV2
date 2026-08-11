"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const techIcons: Record<string, string> = {
  "HTML": "https://cdn.simpleicons.org/html5/E34F26",
  "CSS": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
  "JavaScript": "https://cdn.simpleicons.org/javascript/F7DF1E",
  "Python": "https://cdn.simpleicons.org/python/3776AB",
  "PHP": "https://cdn.simpleicons.org/php/777BB4",
  "Laravel": "https://cdn.simpleicons.org/laravel/FF2D20",
  "Node.js": "https://cdn.simpleicons.org/nodedotjs/339933",
  "Next.js": "https://cdn.simpleicons.org/nextdotjs/000000",
  "React": "https://cdn.simpleicons.org/react/61DAFB",
  "MySQL": "https://cdn.simpleicons.org/mysql/4479A1",
  "PostgreSQL": "https://cdn.simpleicons.org/postgresql/4169E1",
  "Supabase": "https://cdn.simpleicons.org/supabase/3ECF8E",
  "Tailwind CSS": "https://cdn.simpleicons.org/tailwindcss/06B6D4",
  "Tailwind": "https://cdn.simpleicons.org/tailwindcss/06B6D4",
  "Ubuntu": "https://cdn.simpleicons.org/ubuntu/E95420",
  "Debian": "https://cdn.simpleicons.org/debian/A81D33",
  "Docker": "https://cdn.simpleicons.org/docker/2496ED",
  "Apache": "https://cdn.simpleicons.org/apache/D22128",
  "Nginx": "https://cdn.simpleicons.org/nginx/009639",
  "GitHub": "https://cdn.simpleicons.org/github/181717",
  "Claude": "https://cdn.simpleicons.org/claude/D97757",
  "AI": "https://cdn.simpleicons.org/openai/412991",
  "SaaS": "https://cdn.simpleicons.org/icloud/3693F3",
  "E-Commerce": "https://cdn.simpleicons.org/shopify/95BF47",
  "Web Design": "https://cdn.simpleicons.org/figma/F24E1E",
  "CMS": "https://cdn.simpleicons.org/wordpress/21759B",
  "LMS": "https://cdn.simpleicons.org/moodle/F98012",
  "Fullstack": "https://cdn.simpleicons.org/react/61DAFB",
  "Landing Page": "https://cdn.simpleicons.org/html5/E34F26",
  "Photography": "https://cdn.simpleicons.org/instagram/E4405F",
  "Gov": "https://cdn.simpleicons.org/google/4285F4",
  "Portal": "https://cdn.simpleicons.org/google/4285F4",
  "Admin Dashboard": "https://cdn.simpleicons.org/googleanalytics/E37400",
  "Management": "https://cdn.simpleicons.org/jira/0052CC",
  "Tourism": "https://cdn.simpleicons.org/tripadvisor/000000",
  "Company Profile": "https://cdn.simpleicons.org/linkedin/0A66C2",
  "Ticketing": "https://cdn.simpleicons.org/ticketmaster/026CDF",
  "Event": "https://cdn.simpleicons.org/meetup/E0393C",
  "Business": "https://cdn.simpleicons.org/googlebusinessprofile/4285F4",
  "Automotive": "https://cdn.simpleicons.org/tesla/CC0000",
  "Portfolio": "https://cdn.simpleicons.org/behance/1769FF",
  "Creative": "https://cdn.simpleicons.org/adobecreativecloud/DA1F26",
  "Health": "https://cdn.simpleicons.org/applehealth/FF2D55",
  "Information": "https://cdn.simpleicons.org/wikipedia/000000",
  "Corporate": "https://cdn.simpleicons.org/microsoft/5E5E5E",
  "Tech": "https://cdn.simpleicons.org/apple/000000",
  "Cloud": "https://cdn.simpleicons.org/googlecloud/4285F4",
  "DevOps": "https://cdn.simpleicons.org/docker/2496ED",
  "Version Control": "https://cdn.simpleicons.org/git/F05032",
  "Git": "https://cdn.simpleicons.org/git/F05032",
  "Lazygit": "https://cdn.simpleicons.org/git/F05032",
  "GitHub Actions": "https://cdn.simpleicons.org/githubactions/2088FF",
  "CI/CD": "https://cdn.simpleicons.org/githubactions/2088FF",
  "Static Site": "https://cdn.simpleicons.org/html5/E34F26",
  "Load Balancer": "https://cdn.simpleicons.org/nginx/009639",
  "NFS": "https://cdn.simpleicons.org/linux/FCC624",
  "NGINX": "https://cdn.simpleicons.org/nginx/009639",
  "Linux": "https://cdn.simpleicons.org/linux/FCC624",
  "Web Server": "https://cdn.simpleicons.org/apache/D22128",
  "Home Lab": "https://cdn.simpleicons.org/raspberrypi/C51A4A",
  "Server": "https://cdn.simpleicons.org/linux/FCC624",
  "Cloudflare": "https://cdn.simpleicons.org/cloudflare/F38020",
  "API": "https://cdn.simpleicons.org/postman/FF6C37",
  "NodeJs": "https://cdn.simpleicons.org/nodedotjs/339933",
  "IoT": "https://cdn.simpleicons.org/arduino/00979D",
  "VPS": "https://cdn.simpleicons.org/digitalocean/0080FF",
  "Docker Compose": "https://cdn.simpleicons.org/docker/2496ED",
  "Redis": "https://cdn.simpleicons.org/redis/DC382D",
};

export const getTechIcon = (name: string) => {
  return techIcons[name] || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=32`;
};

interface ProjectCardProps {
  project: any;
  onClick: () => void;
  index: number;
  onOpenComments: () => void;
}

export default function ProjectCard({ project, index, onClick, onOpenComments }: ProjectCardProps) {
  const [reactions, setReactions] = useState<Record<string, number>>(project.reactions || {});
  const [userReactions, setUserReactions] = useState<Record<string, boolean>>({});
  const [showCollabPopover, setShowCollabPopover] = useState(false);
  const [showTechPopover, setShowTechPopover] = useState(false);

  useEffect(() => {
    // Load user reactions from local storage
    try {
      const stored = localStorage.getItem(`reactions_${project.id}`);
      if (stored) {
        setUserReactions(JSON.parse(stored));
      }
    } catch (e) {}
  }, [project.id]);

  const handleReaction = async (e: React.MouseEvent, emoji: string) => {
    e.stopPropagation(); // prevent opening modal
    
    const hasReacted = userReactions[emoji];
    const action = hasReacted ? 'remove' : 'add';

    // Optimistic UI update
    setReactions(prev => ({
      ...prev,
      [emoji]: Math.max(0, (prev[emoji] || 0) + (hasReacted ? -1 : 1))
    }));
    
    const newUserReactions = { ...userReactions, [emoji]: !hasReacted };
    setUserReactions(newUserReactions);
    localStorage.setItem(`reactions_${project.id}`, JSON.stringify(newUserReactions));

    // Call API
    try {
      await fetch('/api/projects/react', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id, emoji, action })
      });
    } catch (error) {
      console.error("Failed to react", error);
    }
  };

  const visibleTags = project.tags.slice(0, 5);
  const hiddenTags = project.tags.slice(5);

  return (
    <div 
      onClick={onClick}
      className={`reveal-animate opacity-0 translate-y-12 transition-all duration-1000 cursor-pointer flex flex-col h-full bg-white border border-slate-200/80 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 overflow-visible`}
      style={{ transitionDelay: `${(index % 3) * 150 + 100}ms` }}
    >
      {/* Card Image Wrapper */}
      <div className="relative w-full aspect-[16/10] md:h-[240px] md:aspect-auto rounded-t-[2rem] overflow-hidden bg-[#f6f7f9] shrink-0 border-b border-slate-100">
        <Image unoptimized 
          src={project?.image || "https://wsrv.nl/?url=https%3A%2F%2Fi.ibb.co%2FV0CvQLrN%2FWorksim.png"} 
          alt={project.title} 
          fill 
          className="object-cover object-top transition-transform duration-700 hover:scale-105"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-slate-900/5 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
        </div>
      </div>

      {/* Card Info */}
      <div className="p-6 md:p-8 flex flex-col grow">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h4 className="text-[22px] font-outfit font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1">
            {project.title}
          </h4>
          {project.collaborators && project.collaborators.length > 0 && (
            <div 
              className="relative group/collab shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                setShowCollabPopover(prev => !prev);
              }}
            >
              <div className="flex -space-x-2.5 items-center cursor-pointer">
                {project.collaborators.slice(0, 3).map((col: any, idx: number) => (
                  <div key={col.id || idx} className="w-8 h-8 relative rounded-full overflow-hidden border-2 border-white shadow-sm bg-slate-100">
                    <img 
                      src={col.avatar_url?.includes('i.ibb.co') ? `https://wsrv.nl/?url=${encodeURIComponent(col.avatar_url)}` : col.avatar_url} 
                      alt={col.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {project.collaborators.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-white text-[10px] font-bold border-2 border-white flex items-center justify-center">
                    +{project.collaborators.length - 3}
                  </div>
                )}
              </div>

              {/* Collaborators Dropdown Popover */}
              <div className={`absolute bottom-[calc(100%+10px)] right-0 ${showCollabPopover ? 'flex' : 'hidden'} group-hover/collab:flex flex-col bg-white border border-slate-200 shadow-xl rounded-xl p-3 min-w-[200px] z-50 pointer-events-auto`}>
                <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider px-1">Collaborators</div>
                {project.collaborators.map((col: any, idx: number) => {
                  const content = (
                    <>
                      <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-200 shrink-0">
                        <img 
                          src={col.avatar_url?.includes('i.ibb.co') ? `https://wsrv.nl/?url=${encodeURIComponent(col.avatar_url)}` : col.avatar_url} 
                          alt={col.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="truncate flex-1">{col.name}</span>
                      {col.portfolio_url && (
                        <svg className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-blue-600 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      )}
                    </>
                  );

                  return col.portfolio_url ? (
                    <a 
                      key={col.id || idx}
                      href={col.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2.5 py-1.5 px-2 text-[13px] text-slate-800 font-semibold rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors group/item"
                      title={`Buka portofolio ${col.name}`}
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={col.id || idx} className="flex items-center gap-2.5 py-1.5 px-2 text-[13px] text-slate-800 font-semibold">
                      {content}
                    </div>
                  );
                })}
                {/* Arrow pointing down */}
                <div className="absolute top-full right-4 border-[6px] border-transparent border-t-white"></div>
                <div className="absolute top-full right-4 border-[7px] border-transparent border-t-slate-200 -z-10 -mt-[1px]"></div>
              </div>
            </div>
          )}
        </div>
        <p className="text-slate-500 text-[15px] leading-relaxed font-medium mb-8 line-clamp-2">
          {project.description}
        </p>
        
        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mt-auto mb-6 relative">
          {visibleTags.map((tag: string, i: number) => (
            <span key={i} className="px-2 py-1 bg-slate-50 text-slate-600 text-[11px] font-semibold rounded border border-slate-200 flex items-center gap-1.5 transition-colors hover:bg-slate-100">
              <div className="w-3.5 h-3.5 bg-white shadow-sm border border-slate-100 rounded-[2px] flex items-center justify-center overflow-hidden shrink-0">
                <img src={getTechIcon(tag)} alt={tag} className="w-2.5 h-2.5 object-contain" />
              </div>
              {tag}
            </span>
          ))}
          {hiddenTags.length > 0 && (
            <div 
              className="relative group/tech"
              onClick={(e) => {
                e.stopPropagation();
                setShowTechPopover(prev => !prev);
              }}
            >
              <span className="px-2 py-1 h-full bg-slate-800 text-white text-[11px] font-semibold rounded border border-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-700 transition-colors">
                +{hiddenTags.length}
              </span>
              
              {/* Tech Stack Popover */}
              <div className={`absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 ${showTechPopover ? 'flex' : 'hidden'} group-hover/tech:flex flex-col bg-white border border-slate-200 shadow-xl rounded-xl p-3 w-48 z-50 pointer-events-auto`}>
                <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider px-1">More Tech Stack</div>
                {hiddenTags.map((tag: string, i: number) => (
                  <div key={i} className="flex items-center gap-2.5 py-1.5 px-1 text-[13px] text-slate-700 font-medium">
                    <div className="w-4 h-4 bg-slate-50 border border-slate-100 rounded flex items-center justify-center overflow-hidden shrink-0">
                      <img src={getTechIcon(tag)} alt={tag} className="w-3 h-3 object-contain" />
                    </div>
                    {tag}
                  </div>
                ))}
                {/* Arrow pointing down */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-white"></div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[7px] border-transparent border-t-slate-200 -z-10 -mt-[1px]"></div>
              </div>
            </div>
          )}
        </div>

        {/* Footer: Reactions & Comments */}
        <div className="flex items-center justify-between pt-5 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2 relative">
            {Object.entries(reactions)
              .filter(([_, count]) => count > 0)
              .sort((a, b) => b[1] - a[1]) // Sort by count descending
              .map(([emoji, count]) => (
              <button 
                key={emoji}
                onClick={(e) => handleReaction(e, emoji)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-semibold transition-all
                  ${userReactions[emoji] 
                    ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm' 
                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300'}`}
              >
                <span className="text-sm">{emoji}</span>
                <span>{count}</span>
              </button>
            ))}

            {/* Add Emoji Picker Popover */}
            <div className="relative group/emoji">
              <button className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-slate-400 border border-slate-200 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300 transition-all">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </button>
              
              {/* Emoji Grid Tooltip */}
              <div className="absolute bottom-[calc(100%+8px)] left-0 hidden group-hover/emoji:grid grid-cols-5 gap-1 p-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 w-[190px]">
                {['❤️','👍','🔥','🚀','😂','🎉','👀','✨','💯','🙌'].map(em => (
                  <button 
                    key={em} 
                    onClick={(e) => handleReaction(e, em)} 
                    className="w-[30px] h-[30px] flex items-center justify-center hover:bg-slate-100 rounded-lg text-lg transition-all hover:scale-110 active:scale-95"
                  >
                    {em}
                  </button>
                ))}
                {/* Arrow pointing down */}
                <div className="absolute top-full left-[13px] border-[6px] border-transparent border-t-white"></div>
                <div className="absolute top-full left-[13px] border-[7px] border-transparent border-t-slate-200 -z-10 -mt-[1px]"></div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={(e) => { e.stopPropagation(); onOpenComments(); }}
            className="flex items-center gap-2 text-slate-400 hover:text-blue-500 transition-colors shrink-0 group/comment"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/comment:fill-blue-50 transition-colors">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span className="text-[13px] font-semibold">{project.commentCount || 0}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
