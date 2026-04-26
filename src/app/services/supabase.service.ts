import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ProjectsService } from './projects.service';
import { SkillsService } from './skills.service';
import { SocialNetworksService } from './social-networks.service';
import { ContactMethodsService } from './contact-methods.service';
import { StorageService } from './storage.service';
import { I18nService } from './i18n.service';

/**
 * Backwards-compatible facade. Prefer injecting the domain service directly
 * (AuthService, ProjectsService, SkillsService, SocialNetworksService,
 * ContactMethodsService, StorageService, I18nService) in new code.
 */
@Injectable({ providedIn: 'root' })
export class SupabaseService {
  constructor(
    private auth: AuthService,
    private projectsService: ProjectsService,
    private skillsService: SkillsService,
    private socialNetworksService: SocialNetworksService,
    private contactMethodsService: ContactMethodsService,
    private storageService: StorageService,
    private i18nService: I18nService
  ) { }

  // --- Auth ---
  signIn(email: string, password: string) { return this.auth.signIn(email, password); }
  signOut() { return this.auth.signOut(); }
  isAuthenticated() { return this.auth.isAuthenticated(); }
  refreshSession() { return this.auth.refreshSession(); }

  // --- Projects ---
  getProjects(): Observable<any[]> { return this.projectsService.getProjects(); }
  createProject(project: any) { return this.projectsService.createProject(project); }
  updateProject(id: number, project: any) { return this.projectsService.updateProject(id, project); }
  deleteProject(id: number) { return this.projectsService.deleteProject(id); }
  getProjectSkills(projectId: number) { return this.projectsService.getProjectSkills(projectId); }
  updateProjectSkills(projectId: number, skillIds: number[]) {
    return this.projectsService.updateProjectSkills(projectId, skillIds);
  }

  // --- Skills ---
  getSkillCategories(): Observable<any[]> { return this.skillsService.getSkillCategories(); }
  createSkillCategory(data: any) { return this.skillsService.createSkillCategory(data); }
  deleteSkillCategory(id: number) { return this.skillsService.deleteSkillCategory(id); }
  getSkills(): Observable<any[]> { return this.skillsService.getSkills(); }
  createSkill(data: any) { return this.skillsService.createSkill(data); }
  deleteSkill(id: number) { return this.skillsService.deleteSkill(id); }

  // --- Social Networks ---
  getSocialNetworks(): Observable<any[]> { return this.socialNetworksService.getSocialNetworks(); }
  createSocialNetwork(data: any) { return this.socialNetworksService.createSocialNetwork(data); }
  updateSocialNetwork(id: number, data: any) { return this.socialNetworksService.updateSocialNetwork(id, data); }
  deleteSocialNetwork(id: number) { return this.socialNetworksService.deleteSocialNetwork(id); }

  // --- Contact Methods ---
  getContactMethods(): Observable<any[]> { return this.contactMethodsService.getContactMethods(); }
  createContactMethod(data: any) { return this.contactMethodsService.createContactMethod(data); }
  updateContactMethod(id: number, data: any) { return this.contactMethodsService.updateContactMethod(id, data); }
  deleteContactMethod(id: number) { return this.contactMethodsService.deleteContactMethod(id); }

  // --- Storage ---
  uploadImage(file: File, folder: string = 'projects') { return this.storageService.uploadImage(file, folder); }
  uploadFile(file: File, folder: string = 'resumes') { return this.storageService.uploadFile(file, folder); }

  // --- i18n ---
  getLanguages(): Observable<any[]> { return this.i18nService.getLanguages(); }
  getTranslations(langCode: string): Observable<any> { return this.i18nService.getTranslations(langCode); }
  getAllTranslationValues() { return this.i18nService.getAllTranslationValues(); }
  getKeys(pageFilter?: string) { return this.i18nService.getKeys(pageFilter); }
  createKey(keyName: string, page: string = 'dynamic') { return this.i18nService.createKey(keyName, page); }
  deleteKey(keyId: string) { return this.i18nService.deleteKey(keyId); }
  upsertTranslationValue(keyId: string, langCode: string, value: string) {
    return this.i18nService.upsertTranslationValue(keyId, langCode, value);
  }
  getTranslationValue(keyName: string, langCode: string) {
    return this.i18nService.getTranslationValue(keyName, langCode);
  }
  ensureKey(keyName: string, page: string = 'system') { return this.i18nService.ensureKey(keyName, page); }
  getCVUrl(langCode: string) { return this.i18nService.getCVUrl(langCode); }
}
