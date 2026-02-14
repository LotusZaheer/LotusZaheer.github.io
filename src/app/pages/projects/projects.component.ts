import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Project } from '../../data/projects.data';
import { SupabaseService } from '../../services/supabase.service';
import { languageIcons, markupStyleIcons, libraryIcons, frameworkIcons, platformIcons, apiIcons, TechIcon } from '../../data/tech-icons.data';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {
  private carouselIntervals: { [key: number]: any } = {};
  private progressIntervals: { [key: number]: any } = {};
  readonly CAROUSEL_INTERVAL = 3000;
  readonly PROGRESS_INTERVAL = 30;
  languageIcons = languageIcons;
  markupStyleIcons = markupStyleIcons;
  libraryIcons = libraryIcons;
  frameworkIcons = frameworkIcons;
  platformIcons = platformIcons;
  apiIcons = apiIcons

  readonly fallbackColors = [
    'linear-gradient(135deg, #004466 0%, #00778A 100%)',
    'linear-gradient(135deg, #00778A 0%, #00B8B8 100%)',
    'linear-gradient(135deg, #00B8B8 0%, #AEEB60 100%)',
    'linear-gradient(135deg, #AEEB60 0%, #FFA93C 100%)',
    'linear-gradient(135deg, #FFA93C 0%, #004466 100%)'
  ];

  projects: Project[] = [];

  constructor(private supabase: SupabaseService) { }

  ngOnInit() {
    this.supabase.getProjects().subscribe(data => {
      this.projects = data.map((p: any) => ({
        ...p,
        currentImageIndex: p.currentImageIndex || 0,
        progress: p.progress || 0
      }));
      this.startCarousels();
    });
  }

  ngOnDestroy() {
    this.stopCarousels();
  }

  private startCarousels() {
    this.projects.forEach(project => {

      this.carouselIntervals[project.id] = setInterval(() => {
        project.currentImageIndex = (project.currentImageIndex + 1) % project.images.length;
        project.progress = 0;
      }, this.CAROUSEL_INTERVAL);

      this.progressIntervals[project.id] = setInterval(() => {
        const increment = (100 / (this.CAROUSEL_INTERVAL / this.PROGRESS_INTERVAL));
        project.progress = Math.min(100, project.progress + increment);
      }, this.PROGRESS_INTERVAL);
    });
  }

  private stopCarousels() {
    Object.values(this.carouselIntervals).forEach(interval => clearInterval(interval));
    Object.values(this.progressIntervals).forEach(interval => clearInterval(interval));
  }

  getCurrentImage(project: Project): string {
    return project.images[project.currentImageIndex];
  }

  getProgressWidth(project: Project): string {
    return `${project.progress}%`;
  }

  getFallbackBackground(project: Project): string {
    return this.fallbackColors[project.currentImageIndex % this.fallbackColors.length];
  }

  hasValidImage(project: Project): boolean {
    const imageUrl = this.getCurrentImage(project);
    return typeof imageUrl === 'string' && imageUrl.trim() !== '';
  }

  getIcon(name: string, icons: TechIcon[]): string | null {
    const icon = icons.find(icon => icon.name === name);
    return icon ? icon.iconPath : null;
  }
}
