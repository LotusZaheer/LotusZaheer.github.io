import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MarkdownComponent } from 'ngx-markdown';
import { Project, Skill, projects, skillCategories } from '../../data/portfolio';

interface ProjectView extends Project {
  currentImageIndex: number;
  groupedSkills: { name: string; skills: Skill[] }[];
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MarkdownComponent
  ],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {
  private carouselIntervals: { [key: string]: any } = {};
  readonly CAROUSEL_INTERVAL = 3000;

  readonly fallbackColors = [
    'linear-gradient(135deg, #004466 0%, #00778A 100%)',
    'linear-gradient(135deg, #00778A 0%, #00B8B8 100%)',
    'linear-gradient(135deg, #00B8B8 0%, #AEEB60 100%)',
    'linear-gradient(135deg, #AEEB60 0%, #FFA93C 100%)',
    'linear-gradient(135deg, #FFA93C 0%, #004466 100%)'
  ];

  // Each project's skills, grouped by the categories of the Skills section (same order).
  projects: ProjectView[] = projects.map(p => ({
    ...p,
    currentImageIndex: 0,
    groupedSkills: skillCategories
      .map(cat => ({ name: cat.name, skills: cat.skills.filter(s => p.skills?.includes(s.name)) }))
      .filter(group => group.skills.length > 0)
  }));
  selectedProject: ProjectView | null = null;

  // The last regular card spans the full row when it would otherwise sit alone in it.
  readonly wideProjectId = (() => {
    const regular = this.projects.filter(p => !p.featured);
    return regular.length % 2 === 1 ? regular[regular.length - 1].id : null;
  })();

  constructor(private zone: NgZone) { }

  ngOnInit() {
    this.startCarousels();
  }

  ngOnDestroy() {
    this.stopCarousels();
  }

  private startCarousels() {
    this.zone.runOutsideAngular(() => {
      this.projects.forEach(project => {
        if (!project.images || project.images.length <= 1) return;

        this.carouselIntervals[project.id] = setInterval(() => {
          this.zone.run(() => {
            project.currentImageIndex = (project.currentImageIndex + 1) % project.images!.length;
          });
        }, this.CAROUSEL_INTERVAL);
      });
    });
  }

  private stopCarousels() {
    Object.values(this.carouselIntervals).forEach(interval => clearInterval(interval));
    this.carouselIntervals = {};
  }

  getCurrentImage(project: ProjectView): string {
    return project.images && project.images.length > 0 ? project.images[project.currentImageIndex] : '';
  }

  getFallbackBackground(project: ProjectView): string {
    return this.fallbackColors[project.currentImageIndex % this.fallbackColors.length];
  }

  hasValidImage(project: ProjectView): boolean {
    return this.getCurrentImage(project).trim() !== '';
  }

  openModal(project: ProjectView) {
    this.selectedProject = project;
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  }

  closeModal() {
    this.selectedProject = null;
    document.body.style.overflow = 'auto';
  }
}
