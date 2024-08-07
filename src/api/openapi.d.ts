/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  '/auth/sign-in': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /** Sign In */
    post: operations['sign_in_auth_sign_in_post']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/auth/refresh': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /** Refresh */
    post: operations['refresh_auth_refresh_post']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/auth/logout': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /** Logout */
    post: operations['logout_auth_logout_post']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/profiles/public/{nik}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Get Public Profiles By Nik */
    get: operations['get_public_profiles_by_nik_profiles_public__nik__get']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/profiles/{name}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Get Profile By Name */
    get: operations['get_profile_by_name_profiles__name__get']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/profiles/': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Get All Profiles */
    get: operations['get_all_profiles_profiles__get']
    put?: never
    /** Upsert Profile */
    post: operations['upsert_profile_profiles__post']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/profiles/{profile_id}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    post?: never
    /** Delete Profile */
    delete: operations['delete_profile_profiles__profile_id__delete']
    options?: never
    head?: never
    /** Modify Profile */
    patch: operations['modify_profile_profiles__profile_id__patch']
    trace?: never
  }
  '/user/my/{target}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** My */
    get: operations['my_user_my__target__get']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/user/nik/{nik}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    /** Modify Nik */
    put: operations['modify_nik_user_nik__nik__put']
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/user/nik': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    post?: never
    /** Rm Nik */
    delete: operations['rm_nik_user_nik_delete']
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/user/{nik}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Get Public By Nik */
    get: operations['get_public_by_nik_user__nik__get']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/me': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Get Me */
    get: operations['get_me_me_get']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/hello-world': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Hello World */
    get: operations['hello_world_hello_world_get']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
}
export type webhooks = Record<
  string,
  never
>
export interface components {
  schemas: {
    /**
     * AuthProviderEnum
     * @constant
     */
    AuthProviderEnum: 'google'
    /** AvatarReq */
    AvatarReq: {
      /** Link */
      link: string
      /** Name */
      name?: string | null
      /** Details */
      details?: string | null
    }
    /** AvatarRes */
    AvatarRes: {
      /** Link */
      link: string
      /** Name */
      name?: string | null
      /** Details */
      details?: string | null
      /** Id */
      id: number
      /** User Id */
      user_id: number
    }
    /** ContactReq */
    ContactReq: {
      /** Key */
      key: string
      /** Value */
      value: string
      /** Details */
      details?: string | null
    }
    /** ContactRes */
    ContactRes: {
      /** Key */
      key: string
      /** Value */
      value: string
      /** Details */
      details?: string | null
      /** Id */
      id: number
      /** User Id */
      user_id: number
      /** Profile Id */
      profile_id?:
        | number
        | null
    }
    /** EducationReq */
    EducationReq: {
      /** University */
      university: string
      /** From Date */
      from_date?:
        | string
        | null
      /** To Date */
      to_date?: string | null
      /** Diploma */
      diploma?: string | null
      /** Certificate */
      certificate?:
        | string
        | null
      /** Details */
      details?: string | null
      /** Education */
      education?:
        | string
        | null
      /** Degree */
      degree?: string | null
    }
    /** EducationRes */
    EducationRes: {
      /** University */
      university: string
      /** From Date */
      from_date?:
        | string
        | null
      /** To Date */
      to_date?: string | null
      /** Diploma */
      diploma?: string | null
      /** Certificate */
      certificate?:
        | string
        | null
      /** Details */
      details?: string | null
      /** Education */
      education?:
        | string
        | null
      /** Degree */
      degree?: string | null
      /** Id */
      id: number
      /** User Id */
      user_id: number
      /** Profile Id */
      profile_id?:
        | number
        | null
    }
    /** Exception_400 */
    Exception_400: {
      /** Message */
      message: string
      /** Beauty Message */
      beauty_message?:
        | string
        | null
    }
    /** ExperienceReq */
    ExperienceReq: {
      /** Company */
      company: string
      /** From Date */
      from_date?:
        | string
        | null
      /** To Date */
      to_date?: string | null
      /** Duration */
      duration?: string | null
      /** Details */
      details?: string | null
      /** Position */
      position?: string | null
      /** Certificate */
      certificate?:
        | string
        | null
      /** Reference Letter */
      reference_letter?:
        | string
        | null
    }
    /** ExperienceRes */
    ExperienceRes: {
      /** Company */
      company: string
      /** From Date */
      from_date?:
        | string
        | null
      /** To Date */
      to_date?: string | null
      /** Duration */
      duration?: string | null
      /** Details */
      details?: string | null
      /** Position */
      position?: string | null
      /** Certificate */
      certificate?:
        | string
        | null
      /** Reference Letter */
      reference_letter?:
        | string
        | null
      /** Id */
      id: number
      /** User Id */
      user_id: number
      /** Profile Id */
      profile_id?:
        | number
        | null
    }
    /** HTTPValidationError */
    HTTPValidationError: {
      /** Detail */
      detail?: components['schemas']['ValidationError'][]
    }
    /** HelloWorldRes */
    HelloWorldRes: {
      /** Message */
      message: string
    }
    /** LanguageReq */
    LanguageReq: {
      /** Language */
      language: string
      /** Level */
      level?: string | null
      /** Certificate */
      certificate?:
        | string
        | null
      /** Details */
      details?: string | null
    }
    /** LanguageRes */
    LanguageRes: {
      /** Language */
      language: string
      /** Level */
      level?: string | null
      /** Certificate */
      certificate?:
        | string
        | null
      /** Details */
      details?: string | null
      /** Id */
      id: number
      /** User Id */
      user_id: number
      /** Profile Id */
      profile_id?:
        | number
        | null
    }
    /** ModifyProfileReq */
    ModifyProfileReq: {
      /** Name */
      name?: string | null
      /** Summary */
      summary?: string | null
      /** Details */
      details?: string | null
      /** Contacts */
      contacts?:
        | components['schemas']['ContactReq'][]
        | null
      /** Skills */
      skills?:
        | components['schemas']['SkillReq'][]
        | null
      /** Education */
      education?:
        | components['schemas']['EducationReq'][]
        | null
      /** Experience */
      experience?:
        | components['schemas']['ExperienceReq'][]
        | null
      /** Languages */
      languages?:
        | components['schemas']['LanguageReq'][]
        | null
      avatar?:
        | components['schemas']['AvatarReq']
        | null
    }
    /** PaginatedRes[ProfileRes] */
    PaginatedRes_ProfileRes_: {
      /** Items */
      items: components['schemas']['ProfileRes'][]
      /** Total */
      total: number
      /** Offset */
      offset: number
    }
    /** ProfileReq */
    ProfileReq: {
      /** Name */
      name: string
      /** Summary */
      summary?: string | null
      /** Details */
      details?: string | null
      /** Contacts */
      contacts?:
        | components['schemas']['ContactReq'][]
        | null
      /** Skills */
      skills?:
        | components['schemas']['SkillReq'][]
        | null
      /** Education */
      education?:
        | components['schemas']['EducationReq'][]
        | null
      /** Experience */
      experience?:
        | components['schemas']['ExperienceReq'][]
        | null
      /** Languages */
      languages?:
        | components['schemas']['LanguageReq'][]
        | null
      avatar?:
        | components['schemas']['AvatarReq']
        | null
    }
    /** ProfileRes */
    ProfileRes: {
      /** Id */
      id: number
      /** User Id */
      user_id: number
      /** Name */
      name: string
      /** Summary */
      summary?: string | null
      /** Details */
      details?: string | null
      /**
       * Contacts
       * @default []
       */
      contacts: components['schemas']['ContactRes'][]
      /**
       * Skills
       * @default []
       */
      skills: components['schemas']['SkillRes'][]
      /**
       * Education
       * @default []
       */
      education: components['schemas']['EducationRes'][]
      /**
       * Experience
       * @default []
       */
      experience: components['schemas']['ExperienceRes'][]
      avatar?:
        | components['schemas']['AvatarRes']
        | null
      /**
       * Languages
       * @default []
       */
      languages: components['schemas']['LanguageRes'][]
    }
    /** PublicUserRes */
    PublicUserRes: {
      /** Nik */
      nik: string | null
    }
    /** Refresh */
    Refresh: {
      /** Refresh Token */
      refresh_token: string
    }
    /** RefreshRes */
    RefreshRes: {
      /** Access Token */
      access_token: string
      /** Refresh Token */
      refresh_token: string
      /** Token Type */
      token_type: string
      /** Nik */
      nik?: string | null
    }
    /** SignIn */
    SignIn: {
      /** Credential */
      credential: string
      auth_provider: components['schemas']['AuthProviderEnum']
    }
    /** SignInRes */
    SignInRes: {
      /** Access Token */
      access_token: string
      /** Refresh Token */
      refresh_token: string
      /** Token Type */
      token_type: string
      /** Nik */
      nik?: string | null
    }
    /** SkillReq */
    SkillReq: {
      /** Name */
      name: string
      /** Details */
      details?: string | null
      /** Certificate */
      certificate?:
        | string
        | null
    }
    /** SkillRes */
    SkillRes: {
      /** Name */
      name: string
      /** Details */
      details?: string | null
      /** Certificate */
      certificate?:
        | string
        | null
      /** Profile Id */
      profile_id?:
        | number
        | null
      /** User Id */
      user_id: number
      /** Id */
      id: number
    }
    /** UserRes */
    UserRes: {
      /**
       * Profiles
       * @default []
       */
      profiles: components['schemas']['ProfileRes'][]
    }
    /** ValidationError */
    ValidationError: {
      /** Location */
      loc: (string | number)[]
      /** Message */
      msg: string
      /** Error Type */
      type: string
    }
  }
  responses: never
  parameters: never
  requestBodies: never
  headers: never
  pathItems: never
}
export type $defs = Record<
  string,
  never
>
export interface operations {
  sign_in_auth_sign_in_post: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['SignIn']
      }
    }
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [
            name: string
          ]: unknown
        }
        content: {
          'application/json': components['schemas']['SignInRes']
        }
      }
      /** @description Validation Error */
      422: {
        headers: {
          [
            name: string
          ]: unknown
        }
        content: {
          'application/json': components['schemas']['HTTPValidationError']
        }
      }
    }
  }
  refresh_auth_refresh_post: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['Refresh']
      }
    }
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [
            name: string
          ]: unknown
        }
        content: {
          'application/json': components['schemas']['RefreshRes']
        }
      }
      /** @description Validation Error */
      422: {
        headers: {
          [
            name: string
          ]: unknown
        }
        content: {
          'application/json': components['schemas']['HTTPValidationError']
        }
      }
    }
  }
  logout_auth_logout_post: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [
            name: string
          ]: unknown
        }
        content: {
          'application/json': unknown
        }
      }
    }
  }
  get_public_profiles_by_nik_profiles_public__nik__get: {
    parameters: {
      query?: never
      header?: never
      path: {
        nik: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [
            name: string
          ]: unknown
        }
        content: {
          'application/json': components['schemas']['PaginatedRes_ProfileRes_']
        }
      }
      /** @description Bad Request */
      400: {
        headers: {
          [
            name: string
          ]: unknown
        }
        content: {
          'application/json': components['schemas']['Exception_400']
        }
      }
      /** @description Validation Error */
      422: {
        headers: {
          [
            name: string
          ]: unknown
        }
        content: {
          'application/json': components['schemas']['HTTPValidationError']
        }
      }
    }
  }
  get_profile_by_name_profiles__name__get: {
    parameters: {
      query?: never
      header?: {
        authorization?:
          | string
          | null
      }
      path: {
        name: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [
            name: string
          ]: unknown
        }
        content: {
          'application/json':
            | components['schemas']['ProfileRes']
            | null
        }
      }
      /** @description Validation Error */
      422: {
        headers: {
          [
            name: string
          ]: unknown
        }
        content: {
          'application/json': components['schemas']['HTTPValidationError']
        }
      }
    }
  }
  get_all_profiles_profiles__get: {
    parameters: {
      query?: never
      header?: {
        authorization?:
          | string
          | null
      }
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [
            name: string
          ]: unknown
        }
        content: {
          'application/json': components['schemas']['PaginatedRes_ProfileRes_']
        }
      }
      /** @description Validation Error */
      422: {
        headers: {
          [
            name: string
          ]: unknown
        }
        content: {
          'application/json': components['schemas']['HTTPValidationError']
        }
      }
    }
  }
  upsert_profile_profiles__post: {
    parameters: {
      query?: never
      header?: {
        authorization?:
          | string
          | null
      }
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['ProfileReq']
      }
    }
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [
            name: string
          ]: unknown
        }
        content: {
          'application/json': components['schemas']['ProfileRes']
        }
      }
      /** @description Validation Error */
      422: {
        headers: {
          [
            name: string
          ]: unknown
        }
        content: {
          'application/json': components['schemas']['HTTPValidationError']
        }
      }
    }
  }
  delete_profile_profiles__profile_id__delete: {
    parameters: {
      query?: never
      header?: {
        authorization?:
          | string
          | null
      }
      path: {
        profile_id: number
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Successful Response */
      204: {
        headers: {
          [
            name: string
          ]: unknown
        }
        content?: never
      }
      /** @description Validation Error */
      422: {
        headers: {
          [
            name: string
          ]: unknown
        }
        content: {
          'application/json': components['schemas']['HTTPValidationError']
        }
      }
    }
  }
  modify_profile_profiles__profile_id__patch: {
    parameters: {
      query?: never
      header?: {
        authorization?:
          | string
          | null
      }
      path: {
        profile_id: number
      }
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['ModifyProfileReq']
      }
    }
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [
            name: string
          ]: unknown
        }
        content: {
          'application/json': components['schemas']['ProfileRes']
        }
      }
      /** @description Validation Error */
      422: {
        headers: {
          [
            name: string
          ]: unknown
        }
        content: {
          'application/json': components['schemas']['HTTPValidationError']
        }
      }
    }
  }
  my_user_my__target__get: {
    parameters: {
      query: {
        canditate: string
      }
      header?: {
        authorization?:
          | string
          | null
      }
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [
            name: string
          ]: unknown
        }
        content: {
          'application/json': unknown
        }
      }
      /** @description Validation Error */
      422: {
        headers: {
          [
            name: string
          ]: unknown
        }
        content: {
          'application/json': components['schemas']['HTTPValidationError']
        }
      }
    }
  }
  modify_nik_user_nik__nik__put: {
    parameters: {
      query?: never
      header?: {
        authorization?:
          | string
          | null
      }
      path: {
        nik: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [
            name: string
          ]: unknown
        }
        content: {
          'application/json': components['schemas']['PublicUserRes']
        }
      }
      /** @description Bad Request */
      400: {
        headers: {
          [
            name: string
          ]: unknown
        }
        content: {
          'application/json': components['schemas']['Exception_400']
        }
      }
      /** @description Validation Error */
      422: {
        headers: {
          [
            name: string
          ]: unknown
        }
        content: {
          'application/json': components['schemas']['HTTPValidationError']
        }
      }
    }
  }
  rm_nik_user_nik_delete: {
    parameters: {
      query?: never
      header?: {
        authorization?:
          | string
          | null
      }
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Successful Response */
      204: {
        headers: {
          [
            name: string
          ]: unknown
        }
        content?: never
      }
      /** @description Validation Error */
      422: {
        headers: {
          [
            name: string
          ]: unknown
        }
        content: {
          'application/json': components['schemas']['HTTPValidationError']
        }
      }
    }
  }
  get_public_by_nik_user__nik__get: {
    parameters: {
      query?: never
      header?: never
      path: {
        nik: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [
            name: string
          ]: unknown
        }
        content: {
          'application/json': components['schemas']['PublicUserRes']
        }
      }
      /** @description Validation Error */
      422: {
        headers: {
          [
            name: string
          ]: unknown
        }
        content: {
          'application/json': components['schemas']['HTTPValidationError']
        }
      }
    }
  }
  get_me_me_get: {
    parameters: {
      query?: never
      header?: {
        authorization?:
          | string
          | null
      }
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [
            name: string
          ]: unknown
        }
        content: {
          'application/json': components['schemas']['UserRes']
        }
      }
      /** @description Validation Error */
      422: {
        headers: {
          [
            name: string
          ]: unknown
        }
        content: {
          'application/json': components['schemas']['HTTPValidationError']
        }
      }
    }
  }
  hello_world_hello_world_get: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Successful Response */
      200: {
        headers: {
          [
            name: string
          ]: unknown
        }
        content: {
          'application/json': components['schemas']['HelloWorldRes']
        }
      }
    }
  }
}
