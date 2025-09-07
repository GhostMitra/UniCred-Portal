package com.android.unicred.network

import com.android.unicred.data.*
import retrofit2.Response
import retrofit2.http.*

interface ApiService {
    
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>
    
    @POST("auth/signup")
    suspend fun signup(@Body request: SignupData): Response<User>
    
    @GET("students/{id}")
    suspend fun getStudent(@Path("id") id: String): Response<Student>
    
    @GET("students/{id}/credentials")
    suspend fun getStudentCredentials(@Path("id") id: String): Response<List<Credential>>
    
    @GET("credentials")
    suspend fun getAllCredentials(): Response<List<Credential>>
    
    @POST("credentials")
    suspend fun createCredential(@Body credential: CreateCredentialData): Response<Credential>
    
    @GET("credentials/verify/{credentialId}")
    suspend fun verifyCredential(@Path("credentialId") credentialId: String): Response<VerificationResult>
    
    @GET("students")
    suspend fun getAllStudents(): Response<List<Student>>
    
    @GET("metrics/overview")
    suspend fun getMetricsOverview(): Response<Map<String, Any>>
}

data class CreateCredentialData(
    val title: String,
    val type: CredentialType,
    val institution: String,
    val dateIssued: String,
    val studentId: String? = null,
    val studentName: String? = null
)