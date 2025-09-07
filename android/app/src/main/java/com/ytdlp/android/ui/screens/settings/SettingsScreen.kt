package com.ytdlp.android.ui.screens.settings

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.ytdlp.android.R

data class SettingsItem(
    val title: String,
    val description: String,
    val icon: ImageVector,
    val onClick: () -> Unit
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    onNavigateToGeneral: () -> Unit,
    onNavigateToDownloadDirectory: () -> Unit,
    onNavigateToFormat: () -> Unit,
    onNavigateToNetwork: () -> Unit,
    onNavigateToCustomCommand: () -> Unit,
    onNavigateToLookAndFeel: () -> Unit,
    onNavigateToInterfaceInteraction: () -> Unit,
    onNavigateToAbout: () -> Unit
) {
    val settingsItems = listOf(
        SettingsItem(
            title = stringResource(R.string.general),
            description = stringResource(R.string.general_desc),
            icon = Icons.Default.Settings,
            onClick = onNavigateToGeneral
        ),
        SettingsItem(
            title = stringResource(R.string.download_directory),
            description = stringResource(R.string.download_directory_desc),
            icon = Icons.Default.Folder,
            onClick = onNavigateToDownloadDirectory
        ),
        SettingsItem(
            title = stringResource(R.string.format),
            description = stringResource(R.string.format_desc),
            icon = Icons.Default.VideoFile,
            onClick = onNavigateToFormat
        ),
        SettingsItem(
            title = stringResource(R.string.network),
            description = stringResource(R.string.network_desc),
            icon = Icons.Default.NetworkCheck,
            onClick = onNavigateToNetwork
        ),
        SettingsItem(
            title = stringResource(R.string.custom_command),
            description = stringResource(R.string.custom_command_desc),
            icon = Icons.Default.Terminal,
            onClick = onNavigateToCustomCommand
        ),
        SettingsItem(
            title = stringResource(R.string.look_and_feel),
            description = stringResource(R.string.look_and_feel_desc),
            icon = Icons.Default.Palette,
            onClick = onNavigateToLookAndFeel
        ),
        SettingsItem(
            title = stringResource(R.string.interface_interaction),
            description = stringResource(R.string.interface_interaction_desc),
            icon = Icons.Default.Layers,
            onClick = onNavigateToInterfaceInteraction
        ),
        SettingsItem(
            title = stringResource(R.string.about),
            description = stringResource(R.string.about_desc),
            icon = Icons.Default.Info,
            onClick = onNavigateToAbout
        )
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        // Top App Bar
        TopAppBar(
            title = {
                Text(
                    text = stringResource(R.string.settings),
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Bold
                )
            },
            navigationIcon = {
                IconButton(onClick = { /* Handle back navigation */ }) {
                    Icon(
                        imageVector = Icons.Default.ArrowBack,
                        contentDescription = "Back"
                    )
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(
                containerColor = MaterialTheme.colorScheme.surface
            )
        )

        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            // Battery Configuration Card
            item {
                BatteryConfigurationCard()
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Settings Items
            items(settingsItems) { item ->
                SettingsItemCard(
                    title = item.title,
                    description = item.description,
                    icon = item.icon,
                    onClick = item.onClick
                )
            }
        }
    }
}

@Composable
fun BatteryConfigurationCard() {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.primaryContainer
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = Icons.Default.BatteryChargingFull,
                contentDescription = null,
                modifier = Modifier.size(24.dp),
                tint = MaterialTheme.colorScheme.onPrimaryContainer
            )
            
            Spacer(modifier = Modifier.width(16.dp))
            
            Column(
                modifier = Modifier.weight(1f)
            ) {
                Text(
                    text = stringResource(R.string.battery_configuration),
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Medium,
                    color = MaterialTheme.colorScheme.onPrimaryContainer
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = stringResource(R.string.battery_configuration_desc),
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f)
                )
            }
        }
    }
}

@Composable
fun SettingsItemCard(
    title: String,
    description: String,
    icon: ImageVector,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        onClick = onClick,
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                modifier = Modifier.size(24.dp),
                tint = MaterialTheme.colorScheme.onSurface
            )
            
            Spacer(modifier = Modifier.width(16.dp))
            
            Column(
                modifier = Modifier.weight(1f)
            ) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Medium,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = description,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                )
            }
            
            Icon(
                imageVector = Icons.Default.ChevronRight,
                contentDescription = null,
                modifier = Modifier.size(20.dp),
                tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
            )
        }
    }
}