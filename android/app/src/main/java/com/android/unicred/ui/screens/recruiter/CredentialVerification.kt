package com.android.unicred.ui.screens.recruiter

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.android.unicred.data.VerificationResult

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CredentialVerification() {
    var credentialId by remember { mutableStateOf("") }
    var verificationResult by remember { mutableStateOf<VerificationResult?>(null) }
    var isLoading by remember { mutableStateOf(false) }
    
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text(
                text = "Credential Verification",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(vertical = 8.dp)
            )
        }
        
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(
                    modifier = Modifier.padding(20.dp)
                ) {
                    Text(
                        text = "Verify Credential",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(bottom = 16.dp)
                    )
                    
                    OutlinedTextField(
                        value = credentialId,
                        onValueChange = { credentialId = it },
                        label = { Text("Credential ID") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        leadingIcon = {
                            Icon(
                                imageVector = Icons.Default.Search,
                                contentDescription = "Search"
                            )
                        },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = MaterialTheme.colorScheme.primary,
                            unfocusedBorderColor = MaterialTheme.colorScheme.outline
                        )
                    )
                    
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    Button(
                        onClick = {
                            if (credentialId.isNotBlank()) {
                                isLoading = true
                                // Simulate API call
                                verificationResult = createMockVerificationResult(credentialId)
                                isLoading = false
                            }
                        },
                        modifier = Modifier.fillMaxWidth(),
                        enabled = credentialId.isNotBlank() && !isLoading,
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        if (isLoading) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(20.dp),
                                color = MaterialTheme.colorScheme.onPrimary
                            )
                        } else {
                            Icon(
                                imageVector = Icons.Default.Verified,
                                contentDescription = "Verify",
                                modifier = Modifier.size(20.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Verify Credential")
                        }
                    }
                }
            }
        }
        
        // Verification Result
        verificationResult?.let { result ->
            item {
                VerificationResultCard(result = result)
            }
        }
        
        item {
            Text(
                text = "Recent Verifications",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(vertical = 8.dp)
            )
        }
        
        // Mock recent verifications
        items(5) { index ->
            RecentVerificationItem(
                credentialId = "CRED-${1000 + index}",
                candidateName = "Student ${index + 1}",
                institution = "University ${index + 1}",
                verifiedAt = "2023-12-${20 + index}",
                status = if (index % 2 == 0) "Verified" else "Invalid"
            )
        }
    }
}

@Composable
fun VerificationResultCard(result: VerificationResult) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (result.found) {
                MaterialTheme.colorScheme.primaryContainer
            } else {
                MaterialTheme.colorScheme.errorContainer
            }
        )
    ) {
        Column(
            modifier = Modifier.padding(20.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Verification Result",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )
                Icon(
                    imageVector = if (result.found) Icons.Default.Verified else Icons.Default.Error,
                    contentDescription = "Result",
                    tint = if (result.found) {
                        MaterialTheme.colorScheme.primary
                    } else {
                        MaterialTheme.colorScheme.error
                    }
                )
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            if (result.found) {
                result.candidate?.let { candidate ->
                    VerificationDetailRow(
                        icon = Icons.Default.Person,
                        label = "Candidate",
                        value = candidate.name
                    )
                    VerificationDetailRow(
                        icon = Icons.Default.Email,
                        label = "Email",
                        value = candidate.email
                    )
                }
                
                result.credential?.let { credential ->
                    VerificationDetailRow(
                        icon = Icons.Default.School,
                        label = "Credential",
                        value = credential.title ?: "N/A"
                    )
                    VerificationDetailRow(
                        icon = Icons.Default.Business,
                        label = "Institution",
                        value = credential.institution ?: "N/A"
                    )
                    VerificationDetailRow(
                        icon = Icons.Default.CalendarToday,
                        label = "Date Issued",
                        value = credential.dateIssued ?: "N/A"
                    )
                }
                
                VerificationDetailRow(
                    icon = Icons.Default.Security,
                    label = "Confidence",
                    value = "${(result.verification.confidence * 100).toInt()}%"
                )
            } else {
                Text(
                    text = "Credential not found or invalid",
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onErrorContainer
                )
            }
        }
    }
}

@Composable
fun VerificationDetailRow(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    value: String
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = label,
            modifier = Modifier.size(20.dp),
            tint = MaterialTheme.colorScheme.primary
        )
        Spacer(modifier = Modifier.width(12.dp))
        Text(
            text = "$label:",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.width(100.dp)
        )
        Text(
            text = value,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurface
        )
    }
}

@Composable
fun RecentVerificationItem(
    credentialId: String,
    candidateName: String,
    institution: String,
    verifiedAt: String,
    status: String
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = credentialId,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold
                )
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = if (status == "Verified") {
                        MaterialTheme.colorScheme.primaryContainer
                    } else {
                        MaterialTheme.colorScheme.errorContainer
                    }
                ) {
                    Text(
                        text = status,
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp),
                        style = MaterialTheme.typography.labelSmall,
                        color = if (status == "Verified") {
                            MaterialTheme.colorScheme.onPrimaryContainer
                        } else {
                            MaterialTheme.colorScheme.onErrorContainer
                        },
                        fontWeight = FontWeight.Medium
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = candidateName,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            Text(
                text = institution,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.8f)
            )
            
            Text(
                text = "Verified: $verifiedAt",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.8f)
            )
        }
    }
}

// Mock function to create verification result
private fun createMockVerificationResult(credentialId: String): VerificationResult {
    return if (credentialId.startsWith("CRED-")) {
        VerificationResult(
            found = true,
            candidate = com.android.unicred.data.Candidate(
                name = "John Doe",
                id = "STU001",
                email = "john.doe@university.edu"
            ),
            credential = com.android.unicred.data.CredentialInfo(
                title = "Bachelor of Computer Science",
                type = "Bachelor",
                institution = "University of Technology",
                dateIssued = "2023-06-15",
                status = "Verified",
                credentialId = credentialId
            ),
            verification = com.android.unicred.data.VerificationInfo(
                status = "Verified",
                verifiedAt = "2023-12-20T10:30:00Z",
                blockchainHash = "0x1234567890abcdef",
                confidence = 0.95
            )
        )
    } else {
        VerificationResult(
            found = false,
            verification = com.android.unicred.data.VerificationInfo(
                status = "Not Found",
                confidence = 0.0
            )
        )
    }
}