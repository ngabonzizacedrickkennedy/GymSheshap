package com.sheshape.repository.profile;


import com.sheshape.model.profile.UserPreferences;
import com.sheshape.model.profile.UserPreferences.PrivacyLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserPreferencesRepository extends JpaRepository<UserPreferences, Long> {
    
    Optional<UserPreferences> findByUserId(Long userId);
    
    boolean existsByUserId(Long userId);
    
    void deleteByUserId(Long userId);
    
    @Query("SELECT up FROM UserPreferences up WHERE up.timezone = :timezone")
    List<UserPreferences> findByTimezone(@Param("timezone") String timezone);
    
    @Query("SELECT up FROM UserPreferences up WHERE up.language = :language")
    List<UserPreferences> findByLanguage(@Param("language") String language);
    
    @Query("SELECT up FROM UserPreferences up WHERE up.privacyLevel = :privacyLevel")
    List<UserPreferences> findByPrivacyLevel(@Param("privacyLevel") PrivacyLevel privacyLevel);
    
    @Query("SELECT up FROM UserPreferences up WHERE up.emailNotifications = true")
    List<UserPreferences> findUsersWithEmailNotificationsEnabled();
    
    @Query("SELECT up FROM UserPreferences up WHERE up.pushNotifications = true")
    List<UserPreferences> findUsersWithPushNotificationsEnabled();
}
