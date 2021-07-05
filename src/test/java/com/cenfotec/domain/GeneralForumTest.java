package com.cenfotec.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.cenfotec.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GeneralForumTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(GeneralForum.class);
        GeneralForum generalForum1 = new GeneralForum();
        generalForum1.setId(1L);
        GeneralForum generalForum2 = new GeneralForum();
        generalForum2.setId(generalForum1.getId());
        assertThat(generalForum1).isEqualTo(generalForum2);
        generalForum2.setId(2L);
        assertThat(generalForum1).isNotEqualTo(generalForum2);
        generalForum1.setId(null);
        assertThat(generalForum1).isNotEqualTo(generalForum2);
    }
}
