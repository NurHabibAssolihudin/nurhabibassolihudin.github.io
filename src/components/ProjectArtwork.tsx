import type {PickerProject} from '../data/project-types';

/** Shared by the moving cards and the static case-study cover. */
export default function ProjectArtwork({project}: {project: PickerProject}) {
  if (project.id === 'project-orca')
    return (
      <div className="project-card__art project-card__art--orca" aria-hidden="true">
        <div className="project-card__window">
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
        </div>
        <i className="project-card__sheet" />
        <i className="project-card__sheet" />
      </div>
    );
  if (project.id === 'project-ocaty')
    return (
      <div className="project-card__art project-card__art--ocaty" aria-hidden="true">
        {['identity', 'core', 'commerce'].map((name, i) => (
          <div className="project-card__domain" key={name}>
            <span>{name[0].toUpperCase()}</span>
            <small>{name}</small>
            <i style={{width: `${44 + i * 18}%`}} />
          </div>
        ))}
      </div>
    );
  return (
    <div className="project-card__art project-card__art--oxelot" aria-hidden="true">
      <svg viewBox="0 0 320 210">
        <g className="project-card__storage">
          <path d="m73 112 87-42 87 42-87 44Z" fill="#133e35" />
          <path d="m73 88 87-42 87 42-87 44Z" fill="#2c6b58" />
          <path d="m73 64 87-42 87 42-87 44Z" fill="#d0f0c9" />
          <path d="M73 64v12l87 44v-12m87-44v12l-87 44" fill="#89bc91" />
          <path d="m134 65 26-13 27 13-27 13Z" fill="#173c32" />
        </g>
        <g className="project-card__worker">
          <rect x="33" y="142" width="55" height="37" rx="8" fill="#d0f0c9" />
          <rect x="44" y="152" width="33" height="17" rx="3" fill="#275b4b" />
          <path d="M88 160h34l38-28" fill="none" stroke="#b5dfb0" strokeWidth="3" />
        </g>
        <g className="project-card__worker">
          <rect x="231" y="134" width="55" height="37" rx="8" fill="#d0f0c9" />
          <rect x="242" y="144" width="33" height="17" rx="3" fill="#275b4b" />
          <path d="M231 152h-25l-34-20" fill="none" stroke="#b5dfb0" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}
