package com.cenfotec.config;

import java.time.Duration;
import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;
import org.hibernate.cache.jcache.ConfigSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.boot.info.BuildProperties;
import org.springframework.boot.info.GitProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.*;
import tech.jhipster.config.JHipsterProperties;
import tech.jhipster.config.cache.PrefixedKeyGenerator;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private GitProperties gitProperties;
    private BuildProperties buildProperties;
    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache = jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration =
            Eh107Configuration.fromEhcacheCacheConfiguration(
                CacheConfigurationBuilder
                    .newCacheConfigurationBuilder(Object.class, Object.class, ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                    .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                    .build()
            );
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, com.cenfotec.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, com.cenfotec.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, com.cenfotec.domain.User.class.getName());
            createCache(cm, com.cenfotec.domain.Authority.class.getName());
            createCache(cm, com.cenfotec.domain.User.class.getName() + ".authorities");
            createCache(cm, com.cenfotec.domain.PersistentToken.class.getName());
            createCache(cm, com.cenfotec.domain.User.class.getName() + ".persistentTokens");
            createCache(cm, com.cenfotec.domain.Condo.class.getName());
            createCache(cm, com.cenfotec.domain.Condo.class.getName() + ".iDCondoCommonAreas");
            createCache(cm, com.cenfotec.domain.CommonArea.class.getName());
            createCache(cm, com.cenfotec.domain.CommonArea.class.getName() + ".iDCommonAreaReservations");
            createCache(cm, com.cenfotec.domain.Media.class.getName());
            createCache(cm, com.cenfotec.domain.ExceptionTable.class.getName());
            createCache(cm, com.cenfotec.domain.Reservation.class.getName());
            createCache(cm, com.cenfotec.domain.UserInterface.class.getName());
            createCache(cm, com.cenfotec.domain.Schedule.class.getName());
            createCache(cm, com.cenfotec.domain.Property.class.getName());
            createCache(cm, com.cenfotec.domain.UserProfile.class.getName());
            createCache(cm, com.cenfotec.domain.UserProfile.class.getName() + ".idUserPayments");
            createCache(cm, com.cenfotec.domain.UserProfile.class.getName() + ".idUserGuests");
            createCache(cm, com.cenfotec.domain.UserProfile.class.getName() + ".idUserSchedules");
            createCache(cm, com.cenfotec.domain.UserProfile.class.getName() + ".idUserCondos");
            createCache(cm, com.cenfotec.domain.UserProfile.class.getName() + ".idUserReservations");
            createCache(cm, com.cenfotec.domain.UserProfile.class.getName() + ".idUserAdminWalls");
            createCache(cm, com.cenfotec.domain.UserProfile.class.getName() + ".idUserGeneralForums");
            createCache(cm, com.cenfotec.domain.Guest.class.getName());
            createCache(cm, com.cenfotec.domain.Guest.class.getName() + ".iDGuestCheckLogs");
            createCache(cm, com.cenfotec.domain.SysLog.class.getName());
            createCache(cm, com.cenfotec.domain.CheckLog.class.getName());
            createCache(cm, com.cenfotec.domain.CheckLog.class.getName() + ".iDCheckLogGuests");
            createCache(cm, com.cenfotec.domain.PaymentLog.class.getName());
            createCache(cm, com.cenfotec.domain.Comment.class.getName());
            createCache(cm, com.cenfotec.domain.AdminWall.class.getName());
            createCache(cm, com.cenfotec.domain.AdminWall.class.getName() + ".iDAdminWallComments");
            createCache(cm, com.cenfotec.domain.GeneralForum.class.getName());
            createCache(cm, com.cenfotec.domain.GeneralForum.class.getName() + ".iDGeneralForumComments");
            // jhipster-needle-ehcache-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        } else {
            cm.createCache(cacheName, jcacheConfiguration);
        }
    }

    @Autowired(required = false)
    public void setGitProperties(GitProperties gitProperties) {
        this.gitProperties = gitProperties;
    }

    @Autowired(required = false)
    public void setBuildProperties(BuildProperties buildProperties) {
        this.buildProperties = buildProperties;
    }

    @Bean
    public KeyGenerator keyGenerator() {
        return new PrefixedKeyGenerator(this.gitProperties, this.buildProperties);
    }
}
