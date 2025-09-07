package com.android.unicred.ui.screens.student

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
import com.android.unicred.data.Credential
import com.android.unicred.data.CredentialStatus
import com.android.unicred.data.CredentialType
import com.android.unicred.data.User

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StudentCredentials(user: User) {
    // Mock data for demonstration
    val mockCredentials = remember {
        listOf(
            Credential(
                id = "1",
                title = "Bachelor of Computer Science",
                type = CredentialType.BACHELOR,
                institution = "University of Technology",
                dateIssued = "2023-06-15",
                status = CredentialStatus.VERIFIED,
                studentId = user.studentId ?: "STU001",
                studentName = user.fullName ?: "John Doe",
                blockchainHash = "0x1234567890abcdef"
            ),
            Credential(
                id = "2",
                title = "Machine Learning Certificate",
                type = CredentialType.CERTIFICATE,
                institution = "Tech Academy",
                dateIssued = "2023-08-20",
                status = CredentialStatus.PENDING,
                studentId = user.studentId ?: "STU001",
                studentName = user.fullName ?: "John Doe"
            ),
            Credential(
                id = "3",
                title = "Data Science Diploma",
                type = CredentialType.DIPLOMA,
                institution = "Data Institute",
                dateIssued = "2023-05-10",
                status = CredentialStatus.VERIFIED,
                studentId = user.studentId ?: "STU001",
                studentName = user.fullName ?: "John Doe",
                blockchainHash = "0xabcdef1234567890"
            )
        )
    }
    
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Text(
                text = "My Credentials",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(vertical = 8.dp)
            )
        }
        
        items(mockCredentials) { credential ->
            DetailedCredentialCard(credential = credential)
        }
    }
}

@Composable
fun DetailedCredentialCard(credential: Credential) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(
            modifier = Modifier.padding(20.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = credential.title,
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = credential.institution,
                        style = MaterialTheme.typography.bodyLarge,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                StatusChip(status = credential.status)
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Credential Details
            CredentialDetailRow(
                icon = Icons.Default.School,
                label = "Type",
                value = credential.type.name.lowercase().replaceFirstChar { it.uppercase() }
            )
            
            CredentialDetailRow(
                icon = Icons.Default.CalendarToday,
                label = "Date Issued",
                value = credential.dateIssued
            )
            
            if (credential.blockchainHash != null) {
                CredentialDetailRow(
                    icon = Icons.Default.Security,
                    label = "Blockchain Hash",
                    value = credential.blockchainHash.take(20) + "...",
                    isClickable = true
                )
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Action Buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedButton(
                    onClick = { /* Share credential */ },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Share,
                        contentDescription = "Share",
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Share")
                }
                
                if (credential.status == CredentialStatus.VERIFIED) {
                    Button(
                        onClick = { /* Download PDF */ },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Download,
                            contentDescription = "Download",
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Download")
                    }
                }
            }
        }
    }
}

@Composable
fun CredentialDetailRow(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    value: String,
    isClickable: Boolean = false
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
            color = if (isClickable) {
                MaterialTheme.colorScheme.primary
            } else {
                MaterialTheme.colorScheme.onSurface
            }
        )
    }
}