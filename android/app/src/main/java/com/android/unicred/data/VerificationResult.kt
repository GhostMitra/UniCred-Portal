package com.android.unicred.data

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class VerificationResult(
    val found: Boolean,
    val candidate: Candidate? = null,
    val credential: CredentialInfo? = null,
    val verification: VerificationInfo
) : Parcelable

@Parcelize
data class Candidate(
    val name: String,
    val id: String,
    val email: String
) : Parcelable

@Parcelize
data class CredentialInfo(
    val title: String? = null,
    val type: String? = null,
    val institution: String? = null,
    val dateIssued: String? = null,
    val status: String? = null,
    val credentialId: String? = null
) : Parcelable

@Parcelize
data class VerificationInfo(
    val status: String,
    val verifiedAt: String? = null,
    val blockchainHash: String? = null,
    val confidence: Double
) : Parcelable