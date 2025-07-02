import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoGallery } from './video-gallery';

describe('VideoGallery', () => {
  let component: VideoGallery;
  let fixture: ComponentFixture<VideoGallery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoGallery]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoGallery);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
