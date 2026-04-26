import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Project } from '../../data/projects.data';
import { SupabaseService } from '../../services/supabase.service';
import { MarkdownComponent } from 'ngx-markdown';
// Keep icons for fallback if needed, but we rely on names matching
import { languageIcons, markupStyleIcons, libraryIcons, frameworkIcons, platformIcons, apiIcons, TechIcon } from '../../data/tech-icons.data';

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
  private carouselIntervals: { [key: number]: any } = {};
  readonly CAROUSEL_INTERVAL = 3000;

  // Icons Registry for fallback lookup
  allIcons: TechIcon[] = [
    ...languageIcons,
    ...markupStyleIcons,
    ...libraryIcons,
    ...frameworkIcons,
    ...platformIcons,
    ...apiIcons
  ];

  readonly fallbackColors = [
    'linear-gradient(135deg, #004466 0%, #00778A 100%)',
    'linear-gradient(135deg, #00778A 0%, #00B8B8 100%)',
    'linear-gradient(135deg, #00B8B8 0%, #AEEB60 100%)',
    'linear-gradient(135deg, #AEEB60 0%, #FFA93C 100%)',
    'linear-gradient(135deg, #FFA93C 0%, #004466 100%)'
  ];

  projects: any[] = [];
  selectedProject: any = null;

  constructor(private supabase: SupabaseService, private zone: NgZone) { }

  ngOnInit() {
    this.supabase.getProjects().subscribe(data => {
      this.projects = data.map((p: any) => {
        // Process Skills
        const rawSkills = p.project_skills || [];
        const skills = rawSkills.map((ps: any) => ps.skills); // Flatten

        // Group by Category
        const groups: { [key: string]: any[] } = {};
        const groupOrder: { [key: string]: number } = {};

        skills.forEach((skill: any) => {
          if (skill && skill.skill_categories) {
            const catName = skill.skill_categories.name;
            const order = skill.skill_categories.displayOrder || 99;

            if (!groups[catName]) {
              groups[catName] = [];
              groupOrder[catName] = order;
            }
            groups[catName].push(skill);
          }
        });

        // Convert to Array and Sort by DisplayOrder
        const groupedSkills = Object.keys(groups)
          .map(name => ({
            name,
            skills: groups[name],
            order: groupOrder[name]
          }))
          .sort((a, b) => a.order - b.order);

        return {
          ...p,
          currentImageIndex: p.currentImageIndex || 0,
          groupedSkills, // New processed property
          // Keep legacy arrays for backward compatibility if data exists there
          languages: p.languages || [],
          // etc...
        };
      });
      this.startCarousels();
    });
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
            project.currentImageIndex = (project.currentImageIndex + 1) % project.images.length;
          });
        }, this.CAROUSEL_INTERVAL);
      });
    });
  }

  private stopCarousels() {
    Object.values(this.carouselIntervals).forEach(interval => clearInterval(interval));
    this.carouselIntervals = {};
  }

  getCurrentImage(project: any): string {
    return project.images && project.images.length > 0 ? project.images[project.currentImageIndex] : '';
  }

  getFallbackBackground(project: any): string {
    return this.fallbackColors[project.currentImageIndex % this.fallbackColors.length];
  }

  hasValidImage(project: any): boolean {
    const imageUrl = this.getCurrentImage(project);
    return typeof imageUrl === 'string' && imageUrl.trim() !== '';
  }

  getIcon(name: string): string | null {
    // 1. Try DB icon if available (not implemented in this logic yet, assuming icon property on skill object)
    // 2. Try static mapping
    const icon = this.allIcons.find(icon => icon.name.toLowerCase() === name.toLowerCase());
    return icon ? icon.iconPath : null;
  }

  openModal(project: any) {
    this.selectedProject = project;
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  }

  closeModal() {
    this.selectedProject = null;
    document.body.style.overflow = 'auto';
  }
}
