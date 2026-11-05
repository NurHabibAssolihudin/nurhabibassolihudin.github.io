import * as m from 'motion/react-m';
import type {PickerProject} from '../data/project-types';

/** Shared by the moving cards and the static case-study cover. */
export default function ProjectArtwork({project,active,still=false}: {project: PickerProject; active?:boolean; still?:boolean}) {
  const transition={duration:still?0:.48,ease:[.23,1,.32,1] as [number,number,number,number]};
  if (project.id === 'project-tony') {
    return <div className="project-card__art project-card__art--tony" aria-hidden="true">
      <div className="project-card__connection" />
      {['Letta Code','Tony'].map((label,index)=><m.div className="project-card__module" key={label} initial={false} animate={active===undefined?undefined:{transform:`translate3d(${index===0?-42:42}px,${active&&!still?(index===0?-16:14):(index===0?-6:6)}px,0) rotate(${index===0?-10:10}deg)`}} transition={transition}>
        <span className="project-card__module-mark">{index===0?'L':'T'}</span>
        <span className="project-card__module-label">{label}</span>
        <span className="project-card__module-lines"><i/><i/><i/></span>
      </m.div>)}
    </div>;
  }
  if (project.id === 'project-orca')
    return (
      <div className="project-card__art project-card__art--orca" aria-hidden="true">
        <m.div className="project-card__window" initial={false} animate={active===undefined?undefined:{transform:active?'translate3d(-7px,-5px,20px) rotate(-10deg) rotateY(-7deg)':'rotate(-7deg) rotateY(-12deg)'}} transition={transition}>
          {project.image && (
            <img
              src={project.image}
              srcSet={project.imageSet}
              sizes="(max-width:700px) 280px, 440px"
              width={project.imageWidth}
              height={project.imageHeight}
              alt=""
              draggable={false}
              loading="lazy"
            />
          )}
        </m.div>
        <i className="project-card__sheet" />
        <m.i className="project-card__sheet" initial={false} animate={active===undefined?undefined:{transform:active?'translate3d(10px,5px,0) rotate(19deg)':'rotate(13deg)'}} transition={transition} />
      </div>
    );
  if (project.id === 'project-ocaty')
    return (
      <div className="project-card__art project-card__art--ocaty" aria-hidden="true">
        {['identity', 'core', 'commerce'].map((name, i) => (
          <m.div className="project-card__domain" key={name} initial={false} animate={active===undefined?undefined:{transform:(active?['translate3d(-92px,22px,0) rotate(-20deg)','translate3d(0,-20px,24px) rotate(0deg)','translate3d(92px,18px,48px) rotate(20deg)']:['translate3d(-76px,18px,0) rotate(-13deg)','translate3d(0,-7px,24px) rotate(2deg)','translate3d(78px,15px,48px) rotate(14deg)'])[i]}} transition={transition}>
            <span>{name[0].toUpperCase()}</span>
            <small>{name}</small>
            <i style={{width: `${44 + i * 18}%`}} />
          </m.div>
        ))}
      </div>
    );
  return (
    <div className="project-card__art project-card__art--oxelot" aria-hidden="true">
      <svg viewBox="0 0 320 210">
        <m.g className="project-card__storage" initial={false} animate={active===undefined?undefined:{transform:active?'translateY(-8px)':'translateY(0px)'}} transition={transition}>
          <path d="m73 112 87-42 87 42-87 44Z" fill="#133e35" />
          <path d="m73 88 87-42 87 42-87 44Z" fill="#2c6b58" />
          <path d="m73 64 87-42 87 42-87 44Z" fill="#d0f0c9" />
          <path d="M73 64v12l87 44v-12m87-44v12l-87 44" fill="#89bc91" />
          <path d="m134 65 26-13 27 13-27 13Z" fill="#173c32" />
        </m.g>
        <m.g className="project-card__worker" initial={false} animate={active===undefined?undefined:{transform:active&&!still?['translateY(0px)','translateY(-9px)']:'translateY(0px)',opacity:active&&!still?[1,.65]:1}} transition={active&&!still?{duration:1.6,repeat:Infinity,repeatType:'reverse',ease:'easeInOut'}:transition}>
          <rect x="33" y="142" width="55" height="37" rx="8" fill="#d0f0c9" />
          <rect x="44" y="152" width="33" height="17" rx="3" fill="#275b4b" />
          <path d="M88 160h34l38-28" fill="none" stroke="#b5dfb0" strokeWidth="3" />
        </m.g>
        <m.g className="project-card__worker" initial={false} animate={active===undefined?undefined:{transform:active&&!still?['translateY(-9px)','translateY(0px)']:'translateY(0px)',opacity:active&&!still?[.65,1]:1}} transition={active&&!still?{duration:1.6,repeat:Infinity,repeatType:'reverse',ease:'easeInOut'}:transition}>
          <rect x="231" y="134" width="55" height="37" rx="8" fill="#d0f0c9" />
          <rect x="242" y="144" width="33" height="17" rx="3" fill="#275b4b" />
          <path d="M231 152h-25l-34-20" fill="none" stroke="#b5dfb0" strokeWidth="3" />
        </m.g>
      </svg>
    </div>
  );
}
