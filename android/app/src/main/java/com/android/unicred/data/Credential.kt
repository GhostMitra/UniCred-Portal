package com.android.unicred.data

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Credential(
    val id: String,
    val title: String,
    val type: CredentialType,
    val institution: String,
    val dateIssued: String,
    val status: CredentialStatus,
    val studentId: String? = null,
    val studentName: String? = null,
    val recruiterApproved: Boolean? = null,
    val blockchainHash: String? = null
) : Parcelable

enum class CredentialType {
    BACHELOR,
    MASTER,
    CERTIFICATE,
    DIPLOMA
}

enum class CredentialStatus {
    VERIFIED,
    PENDING,
    EXPIRED
}