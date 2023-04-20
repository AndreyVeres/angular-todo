import { Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { CommonResponseType } from 'src/app/core/models/core.models'
import { ResultCodeEnum } from 'src/app/core/enums/resultCode.enum'
import { Router } from '@angular/router'
import { LoginRequestData, MeResponse } from 'src/app/core/models/auth.models'
import { EMPTY } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { NotificationService } from 'src/app/core/services/notification.service'
import { LoggerService } from 'src/app/shared/services/logger.service'

@Injectable()
export class AuthService {
  isAuth = false
  private logger = new LoggerService()
  resolveAuthRequest: Function = () => { }

  authRequest = new Promise(resolve => {
    this.resolveAuthRequest = resolve
  })

  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService,
  ) { }
  login(data: LoginRequestData) {
    this.http
      .post<CommonResponseType<{ userId: number }>>(`${environment.baseUrl}/auth/login`, data)
      .pipe(catchError(this.errorHandler.bind(this)))
      .subscribe(res => {
        if (res.resultCode === ResultCodeEnum.success) {
          this.isAuth = true
          this.router.navigate(['/'])
          this.logger.info('login success', '')
        } else {

          this.logger.error('login error', '')
          this.notificationService.handleError(res.messages[0])
        }
      })
  }
  logout() {
    this.http
      .delete<CommonResponseType>(`${environment.baseUrl}/auth/login`)
      .pipe(catchError(this.errorHandler.bind(this)))
      .subscribe(res => {
        this.isAuth = false
        if (res.resultCode === ResultCodeEnum.success) {
          this.router.navigate(['/login'])
          this.logger.info('logout success', '')
        }
      })
  }

  me() {
    this.http
      .get<CommonResponseType<MeResponse>>(`${environment.baseUrl}/auth/me`)
      .pipe(catchError(this.errorHandler.bind(this)))
      .subscribe(res => {
        if (res.resultCode === ResultCodeEnum.success) {
          this.isAuth = true
          this.logger.info('me() success', '')
        } else {
          this.logger.warn('me() error', '')
        }
        this.resolveAuthRequest()
      })
  }
  private errorHandler(err: HttpErrorResponse) {
    this.notificationService.handleError(err.message)
    return EMPTY
  }
}
