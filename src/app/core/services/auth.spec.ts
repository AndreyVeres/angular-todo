import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Router } from '@angular/router';
import { LoginRequestData } from 'src/app/core/models/auth.models';
import { environment } from 'src/environments/environment';
import { LoginComponent } from 'src/app/auth/components/login/login.component';
import { ResultCodeEnum } from '../enums/resultCode.enum';


interface ISuccessResponse {
  resultCode: number
}

interface IErrorResponse extends ISuccessResponse {
  messages: string[]
}

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router
  let notifySpy: jasmine.SpyObj<NotificationService>;
  let mockSuccessResponse: ISuccessResponse;
  let mockErrorResponse: IErrorResponse
  let loginRequestData: LoginRequestData

  const routes = [
    { path: 'login', component: LoginComponent },
  ];

  beforeEach(() => {
    notifySpy = jasmine.createSpyObj('NotificationService', ['handleError', 'handleSuccess', 'clear']);
    loginRequestData = { email: 'test', password: 'test', rememberMe: true };
    mockErrorResponse = { resultCode: 1, messages: ['message'] }
    mockSuccessResponse = { resultCode: 0 };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes(routes)],
      providers: [AuthService, { provide: NotificationService, useValue: notifySpy }],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  })

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('set isAuth to true if login() returns success and redirect to "/" ', () => {
    service.login(loginRequestData);
    const req = httpMock.expectOne(`${environment.baseUrl}/auth/login`);
    req.flush(mockSuccessResponse);

    expect(req.request.method).toEqual('POST');
    expect(service.isAuth).toBeTrue();
    expect(router.navigate).toHaveBeenCalledWith(['/'])
  })

  it('set isAuth to false if login() returns error and route equal "/login" ', () => {
    service.login(loginRequestData);
    const req = httpMock.expectOne(`${environment.baseUrl}/auth/login`);
    req.flush(mockErrorResponse);

    expect(req.request.method).toEqual('POST');
    expect(service.isAuth).toBeFalse();
    expect(router.url).toBe('/')
  })

  it('set isAuth to false if logout() called and redirect to "/login" ', () => {
    service.logout();
    const req = httpMock.expectOne(`${environment.baseUrl}/auth/login`);
    req.flush({ resultCode: 0, messages: ['error message'] });

    expect(req.request.method).toEqual('DELETE');
    expect(service.isAuth).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login'])
  })

  it('set isAuth to true if me() returns success', () => {
    service.me();
    const req = httpMock.expectOne(`${environment.baseUrl}/auth/me`);
    req.flush({ resultCode: ResultCodeEnum.success });

    expect(req.request.method).toEqual('GET');
    expect(service.isAuth).toBeTrue();
  });

  it('set isAuth to false if me() returns  error', () => {
    service.me();
    const req = httpMock.expectOne(`${environment.baseUrl}/auth/me`);
    req.flush({ resultCode: ResultCodeEnum.error });

    expect(req.request.method).toEqual('GET');
    expect(service.isAuth).toBeFalse();
  });
});
