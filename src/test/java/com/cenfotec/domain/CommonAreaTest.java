package com.cenfotec.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.cenfotec.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CommonAreaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CommonArea.class);
        CommonArea commonArea1 = new CommonArea();
        commonArea1.setId(1L);
        CommonArea commonArea2 = new CommonArea();
        commonArea2.setId(commonArea1.getId());
        assertThat(commonArea1).isEqualTo(commonArea2);
        commonArea2.setId(2L);
        assertThat(commonArea1).isNotEqualTo(commonArea2);
        commonArea1.setId(null);
        assertThat(commonArea1).isNotEqualTo(commonArea2);
    }
}
