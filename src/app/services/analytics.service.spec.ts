import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnalyticsService, provideRouter([])],
    });
    service = TestBed.inject(AnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should safely handle logEvent calls without throwing', () => {
    expect(() => {
      service.logEvent('test_event', { key: 'value' });
    }).not.toThrow();
  });

  it('should safely handle helper tracking methods', () => {
    expect(() => {
      service.trackResumeDownload();
      service.trackContactClick('email', 'drew@pasttensedraw.com');
      service.trackBlogRead('post-1', 'Test Title', 'Architecture');
      service.trackExperienceFilter('current');
    }).not.toThrow();
  });
});
