import React from 'react';

export default class LoadingManager extends React.Component {
    static currentHeader;

    static subscribeToCurrentHeader(header) {
        this.currentHeader = header;
    }

    static startLoading() {
        this.currentHeader.startLoading();
    }

    static stopLoading() {
        this.currentHeader.stopLoading();
    }
}